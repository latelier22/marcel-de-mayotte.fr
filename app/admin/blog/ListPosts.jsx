"use client";

import React, { useState, useRef, useEffect } from 'react';
import myFetch from '../../components/myFech';
import EditorClient from './EditorClient'; // Ensure you import your editor correctly

function ListPosts({ allPosts }) {
    const [posts, setPosts] = useState(allPosts);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ title: '', content: '', auteur: '', etat: 'brouillon' });
    const [newCommentData, setNewCommentData] = useState({ texte: '', auteur: '', etat: 'à valider', parentPostId: null });
    const [showComments, setShowComments] = useState({});
    const [showNewCommentForm, setShowNewCommentForm] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [lastModifiedPostId, setLastModifiedPostId] = useState(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setPosts(groupPosts(allPosts));
        console.log(allPosts.map( (p) => {p.comments.attributes}));
    }, [allPosts]);

    const groupPosts = (posts) => {
        const parentMap = {};
        posts.forEach(post => {
            if (post.comments && post.comments.data) {
                post.comments = post.comments.data.map(comment => ({
                    ...comment.attributes,
                    id: comment.id
                }));
            }
            parentMap[post.id] = post;
        });
        return Object.values(parentMap);
    };
    
    const toggleComments = (postId) => {
        setShowComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };
    
    
    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setSelectedPost(null);
            setEditing(false);
            setCreatingNew(false);
        }
    };
    

    const handlePostClick = (post) => {
        if (!editing) {
            setSelectedPost(post);
            setEditFormData({ title: post.title, content: post.content, auteur: post.auteur, etat: post.etat });
        }
    };
    
    const handleEditPost = () => {
        setEditing(true);
    };
    

    const handleToggleCommentStatus = async (comment) => {
        const updatedStatus = comment.etat === 'publiée' ? 'à valider' : 'publiée';
        try {
            await myFetch(`/api/comments/${comment.id}`, 'PUT', {
                data: { etat: updatedStatus }
            },"comment");
            // Update local state
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === selectedPost.id
                        ? {
                            ...post,
                            comments: post.comments.map(c =>
                                c.id === comment.id
                                    ? { ...c, etat: updatedStatus }
                                    : c
                            )
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Failed to toggle comment status:', error);
            setError('Failed to toggle comment status due to a network error');
        }
    };
    




    const handleUpdatePost = async () => {
        if (!selectedPost) {
            setError('No post selected for updating.');
            return;
        }
        const payload = { data: editFormData };
        try {
            const response = await myFetch(`/api/posts/${selectedPost.id}`, 'PUT', payload);
            const updatedPost = { id: response.data.id, ...response.data.attributes };
            const updatedPosts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
            setPosts(updatedPosts); // Move the updated post to the top
            setEditing(false);
            setLastModifiedPostId(updatedPost.id);
            setSelectedPost(null);
        } catch (error) {
            console.error('An error occurred while updating post:', error);
            setError('Failed to update post due to a network error');
        }
    };
    
    const handleDeleteComment = async (commentId, postId) => {
        try {
            // Recursively delete comments and their nested comments
            const deleteCommentAndChildren = async (commentId) => {
                // Fetch comment to get its children
                const response = await myFetch(`/api/comments/${commentId}?populate=*`);
                const comment = response.data;
    
                // Recursively delete child comments
                if (comment.comments && comment.comments.data.length > 0) {
                    for (let childComment of comment.comments.data) {
                        await deleteCommentAndChildren(childComment.id);
                    }
                }
    
                // Delete the comment itself
                await myFetch(`/api/comments/${commentId}`, 'DELETE');
            };
    
            await deleteCommentAndChildren(commentId);
    
            // Update the state
            const updatedPosts = posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: post.comments.filter(comment => comment.id !== commentId)
                    };
                }
                return post;
            });
    
            setPosts(updatedPosts);
        } catch (error) {
            console.error('An error occurred while deleting the comment:', error);
            setError('Failed to delete comment due to a network error');
        }
    };
    



    const handleAddComment = (parentPost) => {
        setNewCommentData({ texte: '', auteur: '', etat: 'à valider', parentPostId: parentPost.id });
        setShowNewCommentForm(true);
        console.log("setShowNewCommentForm",showNewCommentForm, parentPost)
        setSelectedPost(parentPost);
    };
    
    const handleSaveNewComment = async () => {
        if (!newCommentData.texte || !newCommentData.auteur) {
            setError('Please fill all fields for the new post.');
            return;
        }
        const payload = { data: newCommentData };
        try {
            console.log("payload",payload)
            const response = await myFetch('/api/comments', 'POST', payload, 'post'); // Assuming comments are posted to /api/comments
            const addedComment = { id: response.data.id, ...response.data.attributes };
            const updatedPosts = posts.map(post => {
                if (post.id === newCommentData.parentPostId) {
                    return { ...post, comments: [...(post.comments || []), addedComment] };
                }
                return post;
            });
            setPosts(updatedPosts);
            setLastModifiedPostId(addedComment.id);
            setNewCommentData({ texte: '', auteur: '', etat: 'brouillon', parentPostId: null });
            setShowNewCommentForm(false);
            setSelectedPost(null);
        } catch (error) {
            console.error('An error occurred while adding a new comment:', error);
            setError('Failed to add new comment due to a network error');
        }
    };
    
    const handleDeletePost = async () => {
        if (!selectedPost) {
            setError('No post selected for deletion.');
            return;
        }
        try {
            await myFetch(`/api/posts/${selectedPost.id}`, 'DELETE');
            const updatedPosts = posts.filter(post => post.id !== selectedPost.id);
            setPosts(updatedPosts);
            setSelectedPost(null);
        } catch (error) {
            console.error('An error occurred while deleting post:', error);
            setError('Failed to delete post due to a network error');
        }
    };
    

    const handleCreateNewPost = async () => {
        if (!editFormData.title || !editFormData.content || !editFormData.auteur) {
            setError('Please fill all fields for the new post.');
            return;
        }
        const payload = { data: editFormData };
        try {
            const response = await myFetch('/api/posts', 'POST', payload);
            const newPost = { id: response.data.id, ...response.data.attributes };
            setPosts([newPost, ...posts]); // Add new post at the beginning
            setLastModifiedPostId(newPost.id);
            setCreatingNew(false);
            setEditFormData({ title: '', content: '', auteur: '', etat: 'brouillon' });
        } catch (error) {
            console.error('An error occurred while creating a new post:', error);
            setError('Failed to create new post due to a network error');
        }
    };
    
    function formatContent(content, maxLength) {
        if (!content) return '';
        const words = content.split(' ');
        if (words.length > maxLength) {
            return words.slice(0, maxLength).join(' ') + '...';
        }
        return content;
    }
    

    const renderButtons = (post) => {
        const hasComments = post.comments && post.comments.length > 0;
    
        if (post === selectedPost && editing) {
            return (
                <div className="flex space-x-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpdatePost}>Save</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => {
                        setEditing(false);
                        setSelectedPost(null);
                    }}>Cancel</button>
                </div>
            );
        } else if (post === selectedPost) {
            return (
                <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleEditPost}>Edit</button>
                    <button className={`text-white px-4 py-2 rounded ${hasComments ? 'bg-neutral-600' : 'bg-red-500'}`} onClick={handleDeletePost} disabled={hasComments}>Delete</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleAddComment(post)}>Add Comment</button>
                    {hasComments && (
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => toggleComments(post.id)}>
                            {showComments[post.id] ? 'Hide comments' : 'Show comments'}
                        </button>
                    )}
                </div>
            );
        }
        return null;
    };
    
    const renderPostFamily = (post) => {
        const hasComments = post.comments && post.comments.length > 0;
        const commentCount = hasComments ? post.comments.length : 0;
    
        return (
            <div key={post.id} className={`p-4 mb-4 cursor-pointer ${post.id === lastModifiedPostId ? 'bg-yellow-200' : ''} ${post === selectedPost ? 'border-green-500 border-solid border-2' : ''}`} onClick={() => handlePostClick(post)}>
                {editing && (post === selectedPost) && (
                    <div className="flex flex-col">
                        <EditorClient
                            initialContent={editFormData.content}
                            onContentChange={(content) => setEditFormData({ ...editFormData, content })}
                        />
                        <input
                            type="text"
                            placeholder="Auteur"
                            value={editFormData.auteur}
                            onChange={(e) => setEditFormData({ ...editFormData, auteur: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <div className="flex space-x-4">
                            <label>
                                <input
                                    type="radio"
                                    value="publiée"
                                    checked={editFormData.etat === "publiée"}
                                    onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                                /> Publiée
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="brouillon"
                                    checked={editFormData.etat === "brouillon"}
                                    onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                                /> Brouillon
                            </label>
                        </div>
                        <div className="flex space-x-2">
                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpdatePost}>Save</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => {
                                setEditing(false);
                                setSelectedPost(null);
                            }}>Cancel</button>
                        </div>
                    </div>
                )}
                {!editing && (
                    <div className={`${post.id === lastModifiedPostId ? 'bg-yellow-200' : 'bg-yellow-100'}`}>
                        <h2 className='text-center my-4'>{post.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: formatContent(post.content, 200) }} />
                        <p className='text-right'>- {post.auteur}</p>
                        <p className='text-right font-bold'>{post.etat}</p>
                        <p className='text-right font-bold'>{`(${commentCount}) commentaires`}</p>
                        {renderButtons(post)}
                        {showNewCommentForm && selectedPost === post && (
                            <div className="flex flex-col mt-4">
                                <textarea
                                    placeholder="Comment text"
                                    value={newCommentData.texte}
                                    onChange={(e) => setNewCommentData({ ...newCommentData, texte: e.target.value })}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Auteur"
                                    value={newCommentData.auteur}
                                    onChange={(e) => setNewCommentData({ ...newCommentData, auteur: e.target.value })}
                                    className="p-2 border rounded mt-2"
                                />
                                <button className="bg-green-500 text-white px-4 py-2 rounded mt-2" onClick={handleSaveNewComment}>Save Comment</button>
                            </div>
                        )}
                        {showComments[post.id] && hasComments && (
                            <div className="mt-4 ml-8 border-l-2 pl-4 text-right text-black">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="mt-2">
                                        <p>{comment.texte}</p>
                                        <p className="text-sm">- {comment.auteur}</p>
                                        <div className="flex space-x-2 justify-end">
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleToggleCommentStatus(comment)}>
                                                {comment.etat === 'publiée' ? 'À valider' : 'Publiée'}
                                            </button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteComment(comment.id, post.id)}>Delete</button>
                                            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleReplyComment(comment)}>Reply</button>
                                        </div>
                                        {/* Display nested comments if any */}
                                        {comment.comments && comment.comments.length > 0 && (
                                            <div className="ml-4 mt-2 border-l-2 pl-4 text-right">
                                                {comment.comments.map(nestedComment => (
                                                    <div key={nestedComment.id} className="mt-2">
                                                        <p>{nestedComment.texte}</p>
                                                        <p className="text-sm">- {nestedComment.auteur}</p>
                                                        <div className="flex space-x-2 justify-end">
                                                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleToggleCommentStatus(nestedComment)}>
                                                                {nestedComment.etat === 'publiée' ? 'À valider' : 'Publiée'}
                                                            </button>
                                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteComment(nestedComment.id, post.id)}>Delete</button>
                                                            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleReplyComment(nestedComment)}>Reply</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <div ref={containerRef} className="container bg-yellow-100 text-red-900 mx-auto my-8 p-4 shadow-lg rounded">
            <button onClick={() => setCreatingNew(true)} className="bg-lime-500 px-4 py-2 rounded mb-4">Create New Post</button>
            {creatingNew && (
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <EditorClient
                        initialContent={editFormData.content}
                        onContentChange={(content) => setEditFormData({ ...editFormData, content })}
                    />
                    <input
                        type="text"
                        placeholder="Auteur"
                        value={editFormData.auteur}
                        onChange={(e) => setEditFormData({ ...editFormData, auteur: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <div className="flex space-x-4">
                        <label>
                            <input
                                type="radio"
                                value="publiée"
                                checked={editFormData.etat === "publiée"}
                                onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                            /> Publiée
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="brouillon"
                                checked={editFormData.etat === "brouillon"}
                                onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                            /> Brouillon
                        </label>
                    </div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreateNewPost}>Create</button>
                </div>
            )}
            {posts.map(post => renderPostFamily(post))}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default ListPosts