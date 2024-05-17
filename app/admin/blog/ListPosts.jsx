"use client"

import React, { useState, useRef, useEffect } from 'react';
import myFetch from '../../components/myFech';
import EditorClient from './EditorClient'; // Ensure you import your editor correctly

function ListPosts({ allPosts }) {
    const [posts, setPosts] = useState(allPosts);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ title: '', content: '', auteur: '', etat: 'brouillon' });
    const [newCommentData, setNewCommentData] = useState({ texte: '', auteur: '', etat: 'brouillon', parentPostId: null });
    const [showComments, setShowComments] = useState({});

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
        console.log(allPosts.map( (p) => {p.comments}));
    }, [allPosts]);



    const groupPosts = (posts) => {
        const parentMap = {};
        posts.forEach(post => {
            if (post.comments) {
                post.comments = post.comments.data; // Assuming Strapi returns comments in the data field
                console.log("comments",post.comments)
            }
            if (post.parentPostId) {
                parentMap[post.parentPostId] = parentMap[post.parentPostId] || [];
                parentMap[post.parentPostId].push(post);
            } else {
                parentMap[post.id] = parentMap[post.id] || [];
                parentMap[post.id].unshift(post); // Ensure parent is first
            }
        });
        return Object.values(parentMap).flat();
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

    const handleUpdatePost = async () => {
        if (!selectedPost) {
            setError('No post selected for updating.');
            return;
        }
        const payload = { data: editFormData };
        try {
            const response = await myFetch(`/api/posts/${selectedPost.id}`, 'PUT', payload);
            const updatedPost = { id: response.data.id, ...response.data.attributes };
            const updatedPosts = posts.filter(post => post.id !== updatedPost.id);
            setPosts([updatedPost, ...updatedPosts]); // Move the updated post to the top
            setEditing(false);
            setLastModifiedPostId(updatedPost.id);
            setSelectedPost(null);
        } catch (error) {
            console.error('An error occurred while updating post:', error);
            setError('Failed to update post due to a network error');
        }
    };

    const handleAddComment = (parentPost) => {
        setNewCommentData({ texte: '', auteur: '', etat: 'brouillon', parentPostId: parentPost.id });
    };

    const handleSaveNewComment = async () => {
        if (!newCommentData.texte || !newCommentData.auteur) {
            setError('Please fill all fields for the new post.');
            return;
        }
        const payload = { data: newCommentData };
        try {
            const response = await myFetch('/api/posts', 'POST', payload);
            const addedPost = { id: response.data.id, ...response.data.attributes };
            const parentIndex = posts.findIndex(p => p.id === newCommentData.parentPostId);
            const newPosts = [...posts];
            newPosts.splice(parentIndex + 1, 0, addedPost); // Insert after parent
            setPosts(newPosts);
            setLastModifiedPostId(addedPost.id);
            setNewCommentData({ texte: '', auteur: '', etat: 'brouillon', parentPostId: null });
            setSelectedPost(null);
        } catch (error) {
            console.error('An error occurred while adding a new comment post:', error);
            setError('Failed to add new comment post due to a network error');
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
                    {hasComments && (
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => toggleComments(post.id)}>
                            {showComments[post.id] ? 'Hide comments' : 'Show comments'}
                        </button>
                    )}
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleAddComment(post)}>Add Comment</button>
                </div>
            );
        }
        return null;
    };

    const renderPostFamily = (post) => {
        const hasComments = post.comments && post.comments.length > 0;
        const commentCount = hasComments ? post.comments.length : 0;
    
        const handleToggleCommentStatus = async (comment) => {
            const updatedStatus = comment.attributes.etat === 'publiée' ? 'brouillon' : 'publiée';
            try {
                await myFetch(`/api/comments/${comment.id}`, 'PUT', {
                    data: { etat: updatedStatus }
                });
                // Update local state
                setPosts(prevPosts =>
                    prevPosts.map(p =>
                        p.id === post.id
                            ? {
                                ...p,
                                comments: p.comments.map(c =>
                                    c.id === comment.id
                                        ? { ...c, attributes: { ...c.attributes, etat: updatedStatus } }
                                        : c
                                )
                            }
                            : p
                    )
                );
            } catch (error) {
                console.error('Failed to toggle comment status:', error);
            }
        };
    
        const handleDeleteComment = async (comment) => {
            try {
                await myFetch(`/api/comments/${comment.id}`, 'DELETE');
                // Update local state
                setPosts(prevPosts =>
                    prevPosts.map(p =>
                        p.id === post.id
                            ? {
                                ...p,
                                comments: p.comments.filter(c => c.id !== comment.id)
                            }
                            : p
                    )
                );
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
        };
    
        const handleReplyComment = (parentComment) => {
            setNewCommentData({
                texte: '',
                auteur: '',
                etat: 'brouillon',
                parentCommentId: parentComment.id,
                parentPostId: post.id
            });
            setSelectedPost(post);
            setEditing(false); // Ensure editing mode is off
            setCreatingNew(false); // Ensure creating new post mode is off
        };
    
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
                        {showComments[post.id] && hasComments && (
                            <div className="mt-4 ml-8 border-l-2 pl-4 text-right text-black">
                                {post.comments.map(comment => (
                                    <div key={comment.id} className="mt-2">
                                        <p>{comment.attributes.texte}</p>
                                        <p className="text-sm">- {comment.attributes.auteur}</p>
                                        <div className="flex space-x-2 justify-end">
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleToggleCommentStatus(comment)}>
                                                {comment.attributes.etat === 'publiée' ? 'Brouillon' : 'Publiée'}
                                            </button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteComment(comment)}>Delete</button>
                                            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleReplyComment(comment)}>Reply</button>
                                        </div>
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

export default ListPosts;