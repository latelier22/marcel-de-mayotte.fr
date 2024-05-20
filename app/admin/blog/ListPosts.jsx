"use client";

import React, { useState, useRef, useEffect } from 'react';
import myFetch from '../../components/myFetch';
import EditorClient from './EditorClient'; // Ensure you import your editor correctly
import Image from 'next/image';
import getBaseUrl from '../../components/getBaseUrl';

function ListPosts({ allPosts, allComments }) {
    const [posts, setPosts] = useState(allPosts);
    const [comments, setComments] = useState(allComments);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ title: '', content: '', auteur: '', etat: 'brouillon' });
    const [newCommentData, setNewCommentData] = useState({ texte: '', auteur: '', etat: 'à valider', parentPostId: null });
    const [showComments, setShowComments] = useState(false);
    const [showNewCommentForm, setShowNewCommentForm] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [lastModifiedPostId, setLastModifiedPostId] = useState(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setPosts(groupPosts(allPosts, allComments));
        console.log(posts)
    }, [allComments, allPosts]);



    const groupPosts = (posts, comments) => {
        if (!Array.isArray(comments)) return posts;
        return posts.map(post => ({
            ...post,
            comments: comments.filter(comment => comment.post === post.id).map(comment => comment.id)
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

    const handleDeletePost = async (postId) => {

        try {
            await myFetch(`/api/posts/${postId}`, 'DELETE', null, "delete post");
            const updatedPosts = posts.filter(post => post.id !== postId);
            setPosts(updatedPosts);
        } catch (error) {
            console.error('An error occurred while deleting the post:', error);
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
            // Normaliser le post comme dans fetchPosts
            const newPost = {
                id: response.data.id,
                imageUrl: response.data.attributes.medias && response.data.attributes.medias.data && response.data.attributes.medias.data.length > 0
                    ? response.data.attributes.medias.data[0].attributes.url
                    : null,
                title: response.data.attributes.title,
                content: response.data.attributes.content,
                auteur: response.data.attributes.auteur,
                etat: response.data.attributes.etat,
                createdAt: response.data.attributes.createdAt,
                updatedAt: response.data.attributes.updatedAt,
                publishedAt: response.data.attributes.publishedAt,
                comments: response.data.attributes.comments && response.data.attributes.comments.data
                    ? response.data.attributes.comments.data.map(comment => comment.id)
                    : []  // Assurez-vous que 'comments' est initialisé comme un tableau vide
            };
            setPosts([newPost, ...posts]);
            setLastModifiedPostId(newPost.id);
            setCreatingNew(false);
            setEditFormData({ title: '', content: '', auteur: '', etat: 'brouillon' });
        } catch (error) {
            console.error('An error occurred while creating a new post:', error);
            setError('Failed to create new post due to a network error');
        }
    };


    const toggleComments = (postId) => {
        setShowComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleToggleCommentStatus = async (comment) => {
        const updatedStatus = comment.etat === 'validée' ? 'à valider' : 'validée';
        try {
            await myFetch(`/api/comments/${comment.id}`, 'PUT', { data: { etat: updatedStatus } }, 'comment');
            const updatedComments = comments.map(c => c.id === comment.id ? { ...c, etat: updatedStatus } : c);
            setComments(updatedComments);
        } catch (error) {
            console.error('Failed to toggle comment status:', error);
            setError('Failed to toggle comment status due to a network error');
        }
    };

    const handleDeleteComment = async (commentId, myPost) => {
        try {
            // Function to recursively find all child comment IDs
            const findAllChildIds = (id, allComments) => {
                let childIds = allComments.filter(comment => comment.parent_comment === id).map(comment => comment.id);
                return childIds.reduce((acc, childId) => acc.concat(childId, findAllChildIds(childId, allComments)), []);
            };

            // Collect all IDs to delete (the comment itself and all its children)
            const idsToDelete = [commentId, ...findAllChildIds(commentId, comments)];

            // Delete comments from the backend - assuming batch delete isn't supported, loop through each
            for (const id of idsToDelete) {
                await myFetch(`/api/comments/${id}`, 'DELETE');
            }

            // Update the comments state to remove the deleted comments
            setComments(prevComments => prevComments.filter(comment => !idsToDelete.includes(comment.id)));

            // Update posts state to reflect the removal of comments
            setPosts(prevPosts => prevPosts.map(post => {
                return {
                    ...post,
                    comments: post.comments.filter(id => !idsToDelete.includes(id))
                };
            }));

            // Maintenir le focus sur le post parent du commentaire supprimé
            setSelectedPost(myPost);
            setLastModifiedPostId(myPost.id);

            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('An error occurred while deleting the comment:', error);
            setError('Failed to delete comment due to a network error');
        }
    };



    const handleAddComment = (parentPost) => {
        setNewCommentData({ texte: '', auteur: '', etat: 'à valider', parentPostId: parentPost.id, parentCommentId: null });
        setShowNewCommentForm(true);
        setSelectedPost(parentPost);
    };
    const handleSaveNewComment = async () => {
        if (!newCommentData.texte || !newCommentData.auteur) {
            setError('Veuillez remplir tous les champs pour le nouveau commentaire.');
            return;
        }

        const payload = {
            data: {
                texte: newCommentData.texte,
                auteur: newCommentData.auteur,
                etat: 'à valider',
                post: { id: selectedPost.id },
                parent_comment: newCommentData.parentCommentId ? { id: newCommentData.parentCommentId } : undefined
            }
        };

        try {
            const response = await myFetch('/api/comments', 'POST', payload);
            const addedComment = { id: response.data.id, ...response.data.attributes, child_comments: [] };

            // Mettre à jour l'état des commentaires
            setComments(prevComments => {
                // Add new comment to the comments list
                const updatedComments = [...prevComments, addedComment];

                // If the comment has a parent, add this comment's ID to the parent's child_comments array
                if (newCommentData.parentCommentId) {
                    return updatedComments.map(comment => {
                        if (comment.id === newCommentData.parentCommentId) {
                            return {
                                ...comment,
                                child_comments: [...comment.child_comments, addedComment.id]
                            };
                        }
                        return comment;
                    });
                }

                return updatedComments;
            });

            // Update posts state to reflect new comment count or nesting
            setPosts(prevPosts => prevPosts.map(post => {
                if (post.id === selectedPost.id) {
                    let newComments = [...post.comments];
                    if (!newCommentData.parentCommentId) {
                        newComments.push(addedComment.id);
                    }
                    return {
                        ...post,
                        comments: newComments
                    };
                }
                return post;
            }));

            setNewCommentData({ texte: '', auteur: '', etat: 'à valider', parentPostId: null, parentCommentId: null });
            setShowNewCommentForm(false);
            // setShowComments(true)
            setSelectedPost(selectedPost.id);
            setLastModifiedPostId(selectedPost.id);
        } catch (error) {
            console.error('Une erreur est survenue lors de l\'ajout d\'un nouveau commentaire :', error);
            setError('Impossible d\'ajouter un nouveau commentaire en raison d\'une erreur réseau');
        }
    };


    const handleReplyComment = (parentComment) => {
        setNewCommentData({ texte: '', auteur: '', etat: 'à valider', parentPostId: selectedPost.id, parentCommentId: parentComment.id });
        setShowNewCommentForm(true);
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
        } else if (post === selectedPost || post.id === lastModifiedPostId) {
            return (
                <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleEditPost}>Edit</button>
                    <button className={`text-white px-4 py-2 rounded ${hasComments ? 'bg-neutral-600' : 'bg-red-500'}`} onClick={() => handleDeletePost(post.id)} disabled={hasComments}>Delete</button>
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

    const renderCommentTree = (comment, allComments, post) => {
        return (
            <div key={comment.id} className="mt-2 mr-4 border-r-2 border-red-800 pr-4">
                <p>{comment.texte}</p>
                <p className="text-sm">- {comment.auteur}</p>
                <div className="flex space-x-2 justify-end">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleToggleCommentStatus(comment)}>
                        {comment.etat === 'validée' ? 'validée => à valider' : 'à valider => validée'}
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteComment(comment.id, post)}>Delete</button>
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleReplyComment(comment)}>Reply</button>
                </div>
                {comment.child_comments && comment.child_comments.length > 0 && (
                    <div className="ml-4 border-l-2 pl-4">
                        {comment.child_comments.map(childId => {
                            const childComment = allComments.find(c => c.id === childId);
                            return childComment ? renderCommentTree(childComment, allComments, post) : null;
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderComments = (commentIds, allComments, post) => {
        const rootComments = commentIds.map(id => allComments.find(c => c.id === id && !c.parent_comment));
        return rootComments.map(comment => comment ? renderCommentTree(comment, allComments, post) : null);
    };


    const renderPostFamily = (post) => {
        const hasComments = post.comments && post.comments.length > 0;
        const commentCount = hasComments ? post.comments.length : 0;
        const baseURL = post.imageUrl && getBaseUrl(post.imageUrl);
        const fullImageUrl = post.imageUrl ? `${baseURL}${post.imageUrl}` : `https://placehold.co/600x400/EECC44/000000/png?font=monserrat&text=${encodeURIComponent(post.title)}`;


        return (
            <div key={post.id} className={`p-4 mb-4 flex flex-col md:flex-row items-center cursor-pointer ${post.id === lastModifiedPostId ? 'bg-yellow-200' : ''} ${post === selectedPost ? 'border-green-500 border-solid border-2' : ''}`} onClick={() => handlePostClick(post)}>
                <div className=''
                style={{ minWidth: '15vw' }} 
                >
                    <Image
                      src={fullImageUrl}
                      className={`mb-5 w-96 h-96  object-cover object-center `}
                        loading="lazy"
                         width="300"
                         height="300"

                    />
                </div>
                {editing && post === selectedPost ? (
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Titre"
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
                                    checked={editFormData.etat === 'publiée'}
                                    onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                                /> Publiée
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="brouillon"
                                    checked={editFormData.etat === 'brouillon'}
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
                ) : (
                    <div className={`${post.id === lastModifiedPostId ? 'bg-yellow-200' : 'bg-yellow-100'}`}>
                        <h2 className="text-center my-4">{post.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: formatContent(post.content, 200) }} />
                        <p className="text-right">- {post.auteur}</p>
                        <p className="text-right font-bold">{post.etat}</p>
                        <p className="text-right font-bold">{`(${commentCount}) commentaires`}</p>
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
                                {renderComments(post.comments, comments, post)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div ref={containerRef} className="container bg-yellow-100 text-red-900 mx-auto my-8 p-4 shadow-lg rounded">
            {creatingNew && (<button className="bg-green-500 text-white px-4 py-2 rounded w-full" onClick={handleCreateNewPost}>SAVE New Post</button>)}
            {!creatingNew && (<button onClick={() => {
                setCreatingNew(true);
                // Réinitialiser les données du formulaire
                setEditFormData({ title: '', content: '', auteur: '', etat: 'brouillon' });
            }} className="bg-lime-500 px-4 py-2 rounded mb-4">Create New Post</button>)}

            <div ref={containerRef} className="container bg-yellow-100 text-red-900 mx-auto my-8 p-4 shadow-lg rounded">



                {creatingNew ? (
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
                                    checked={editFormData.etat === 'publiée'}
                                    onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                                /> Publiée
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="brouillon"
                                    checked={editFormData.etat === 'brouillon'}
                                    onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                                /> Brouillon
                            </label>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreateNewPost}>SAVE New Post</button>
                    </div>
                ) : (
                    posts.map(post => renderPostFamily(post))
                )}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default ListPosts;
