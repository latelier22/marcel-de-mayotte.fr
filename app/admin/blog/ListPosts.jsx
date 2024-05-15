"use client"
import React, { useState, useRef, useEffect } from 'react';
import myFetch from '../../components/myFech';
import RichText from '../../components/blog/RichText';

function ListPosts({ allPosts }) {
    const [posts, setPosts] = useState(allPosts);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ texte: '', auteur: '', etat: 'brouillon' });
    const [newCommentData, setNewCommentData] = useState({ texte: '', auteur: '', etat: 'brouillon', parentPostId: null });
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [lastModifiedPostId, setLastModifiedPostId] = useState(null);

    console.log(allPosts);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelectedPost(null);
                setEditing(false);
                setCreatingNew(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const groupPosts = (posts) => {
            const parentMap = {};
            posts.forEach(post => {
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
        setPosts(groupPosts(allPosts));
    }, [allPosts]);

    const handlePostClick = (post) => {
        if (!editing) {
            setSelectedPost(post);
            setEditFormData({ texte: post.texte, auteur: post.auteur, etat: post.etat });
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
    
        // Prepare the payload with the necessary data format
        const payload = {
            data: editFormData // Assuming editFormData already contains { texte, auteur, etat }
        };
    
        try {
            const response = await myFetch(`/api/posts/${selectedPost.id}`, 'PUT', payload, 'post');
    
            // Assuming response structure has a top-level `data` field which contains `id` and `attributes`
            const updatedPost = {
                id: response.data.id,
                ...response.data.attributes
            };
    
            console.log("UPDATED CITATION", updatedPost);
    
            // Update the list of posts
            const updatedPosts = posts.map(post =>
                post.id === updatedPost.id ? { ...post, ...editFormData } : post
            );
    
            setPosts(updatedPosts);
            setEditing(false);
            setLastModifiedPostId(updatedPost.id);
            setSelectedPost(null);
        } catch (error) {
            console.error(`An error occurred while updating post:`, error);
            setError('Failed to update post due to a network error');
        }
    };
    
    const handleAddComment = (parentPost) => {
        console.log("reset");
        setNewCommentData({ texte: '', auteur: '', etat: 'brouillon', parentPostId: parentPost.id });
    };



    const handleSaveNewComment = async () => {
        if (!newCommentData.texte || !newCommentData.auteur) {
            setError('Please fill all fields for the new post.');
            return;
        }
    
        // Prepare the payload with the necessary data format
        const payload = {
            data: newCommentData // Assuming newCommentData contains { texte, auteur, etat, parentPostId }
        };
    
        try {
            const response = await myFetch('/api/posts', 'POST', payload, 'post');
    
            const addedPost = {
                id: response.data.id,
                ...response.data.attributes
            }

            console.log("ADDED NEW COMMENT CITATION", addedPost);

            let newPosts = [...posts];
            // Find the last comment of this parent to insert the new comment after
            const parentCommentren = newPosts.filter(c => c.parentPostId === newCommentData.parentPostId);
            let insertIndex = newPosts.findIndex(c => c.id === newCommentData.parentPostId);
            if (parentCommentren.length > 0) {
                const lastComment = parentCommentren[parentCommentren.length - 1];
                insertIndex = newPosts.indexOf(lastComment) + 1;
            } else {
                insertIndex += 1; // If no commentren, insert after the parent
            }
            addedPost.parentPostId = newCommentData.parentPostId; // Ensure it has the correct parent ID
            newPosts.splice(insertIndex, 0, addedPost);
    
            setPosts(newPosts);
            setLastModifiedPostId(addedPost.id);
            setNewCommentData({ texte: '', auteur: '', etat: 'brouillon', parentPostId: null }); // Reset form data
            setSelectedPost(null);
        } catch (error) {
            console.error(`An error occurred while adding a new comment post:`, error);
            setError('Failed to add new comment post due to a network error');
        }
    };

    

    // const handleSaveNewComment = async () => {
    //     if (!newCommentData.texte || !newCommentData.auteur) {
    //         setError('Please fill all fields for the new post.');
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`http://localhost:3976/api/posts/createPost`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(newCommentData)
    //         });

    //         if (!response.ok) throw new Error('Failed to add new comment post');

    //         const data = await response.json();
    //         const addedPost = data.post;
    //         let newPosts = [...posts];
    //         // Find the last comment of this parent to insert the new comment after
    //         const parentCommentren = newPosts.filter(c => c.parentPostId === newCommentData.parentPostId);
    //         let insertIndex = newPosts.findIndex(c => c.id === newCommentData.parentPostId);
    //         if (parentCommentren.length > 0) {
    //             const lastComment = parentCommentren[parentCommentren.length - 1];
    //             insertIndex = newPosts.indexOf(lastComment) + 1;
    //         } else {
    //             insertIndex += 1; // If no commentren, insert after the parent
    //         }
    //         addedPost.parentPostId = newCommentData.parentPostId; // Ensure it has the correct parent ID
    //         newPosts.splice(insertIndex, 0, addedPost);
    //         setLastModifiedPostId(addedPost.id);
    //         setPosts(newPosts);
    //         setNewCommentData({ texte: '', auteur: '', etat: 'brouillon', parentPostId: null }); // Reset form data
    //         setSelectedPost(null);
    //     } catch (error) {
    //         console.error(`An error occurred while adding a new comment post:`, error);
    //         setError('Failed to add new comment post due to a network error');
    //     }
    // };


    const handleDeletePost = async () => {
        if (!selectedPost) {
            setError('No post selected for deletion.');
            return;
        }
    
        try {
            const response = await myFetch(`/api/posts/${selectedPost.id}`, 'DELETE', null, 'posts');
            console.log(response);
    
            console.log(`post ${selectedPost.id} deleted successfully`);
    
            const updatedPosts = posts.filter(c => c.id !== selectedPost.id);
            setPosts(updatedPosts);
            setSelectedPost(null);
        } catch (error) {
            console.error(`An error occurred while deleting post:`, error);
            setError('Failed to delete post due to a network error');
        }
    };
    



    const handleCreateNewPost = async () => {
        if (!editFormData.texte || !editFormData.auteur) {
            setError('Please fill all fields for the new post.');
            return;
        }
    
        // Prepare the data in the format expected by the backend
        const payload = {
            data: editFormData // Assuming editFormData already contains { texte, auteur, etat }
        };
    
        console.log("Sending payload:", payload);
    
        try {
            const response = await myFetch('/api/posts', 'POST', payload, 'post');
            const newPost = {
                id: response.data.id,
                ...response.data.attributes
            }
            setPosts([...posts, newPost]);
            setLastModifiedPostId(newPost.id);
            setCreatingNew(false);
            setEditFormData({ texte: '', auteur: '', etat: '' });
        } catch (error) {
            console.error(`An error occurred while creating a new post:`, error);
            setError('Failed to create new post due to a network error');
        }
    };
    

    const renderPostFamily = (post) => {
        // Determine if the post has commentren
        const hasCommentren = posts.some(comment => comment.parentPostId === post.id);

        return (
            <div key={post.id} className={`p-4 mb-4 cursor-pointer ${post.id === lastModifiedPostId ? 'bg-gray-800' : ''} ${post === selectedPost ? 'border-green-500 border-solid border-2' : ''}`} onClick={() => handlePostClick(post)}>
                {editing && post === selectedPost ? (
                    <div className="flex flex-col">
                        <input className="flex flex-col bg-black p-4 " type="textarea" value={editFormData.texte} onChange={e => setEditFormData({ ...editFormData, texte: e.target.value })} />
                        <input className="flex flex-col bg-black p-4 " type="text" value={editFormData.auteur} onChange={e => setEditFormData({ ...editFormData, auteur: e.target.value })} />
                        <div className="flex flex-col">
                            <label className="mr-2">
                                <input type="radio" value="publiée" checked={editFormData.etat === "publiée"} onChange={e => setEditFormData({ ...editFormData, etat: e.target.value })} />
                                Publiée
                            </label>
                            <label>
                                <input type="radio" value="brouillon" checked={editFormData.etat === "brouillon"} onChange={e => setEditFormData({ ...editFormData, etat: e.target.value })} />
                                Brouillon
                            </label>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpdatePost}>Save</button>
                    </div>
                ) : (
                    <div>
                        <p className="text-3xl">&quot;{post.texte}&quot;</p>
                        <p className="text-right text-2xl italic">- {post.auteur}</p>
                        <p className="text-sm text-green-300">{post.etat}</p>
                        {post === selectedPost && (
                            <>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleEditPost}>Edit</button>
                                <button className={`${hasCommentren ? 'bg-neutral-600' : 'bg-red-500'
                                    } text-white px-4 py-2 rounded`} onClick={handleDeletePost} disabled={hasCommentren}>Delete</button>
                                {!post.parentPostId && <button className="bg-blue-300 text-white px-4 py-2 rounded" onClick={() => handleAddComment(post)}>Add Comment</button>}
                            </>
                        )}
                    </div>
                )}
                {selectedPost === post && newCommentData.parentPostId === post.id && (
                    <div className="flex flex-col bg-black p-4 border-l-4 border-green-500 ml-4">
                        <input className="flex flex-col bg-black p-4 " type="textarea" placeholder="Texte" value={newCommentData.texte} onChange={e => setNewCommentData({ ...newCommentData, texte: e.target.value })} />
                        <input className="flex flex-col bg-black p-4 " type="text" placeholder="Auteur" value={newCommentData.auteur} onChange={e => setNewCommentData({ ...newCommentData, auteur: e.target.value })} />
                        <div className="flex flex-col">
                            <label className="mr-2">
                                <input
                                    type="radio"
                                    value="publiée"
                                    checked={editFormData.etat === 'publiée'}
                                    onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                                />
                                Publiée
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="brouillon"
                                    checked={editFormData.etat === 'brouillon'}
                                    onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                                />
                                Brouillon
                            </label>
                        </div>
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSaveNewComment}>Save New Comment</button>
                    </div>
                )}
            </div>
        );
    };


    return (
        <div ref={containerRef} className="container mx-auto my-8 p-4 shadow-lg rounded">
            <button onClick={() => setCreatingNew(true)} disabled={selectedPost} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
                Create New Post
            </button>
            {creatingNew && (
                <div className="new-post-form p-4 border border-gray-300 rounded">
                    <input
                        className="flex w-full flex-col bg-black p-4 "
                        type="textarea"
                        placeholder="Saisir votre post"
                        value={editFormData.texte}
                        onChange={(e) => setEditFormData({ ...editFormData, texte: e.target.value })}
                    />
                    <input
                        className="flex flex-col bg-black p-4 "
                        type="text"
                        placeholder="Saisir l'auteur"
                        value={editFormData.auteur}
                        onChange={(e) => setEditFormData({ ...editFormData, auteur: e.target.value })}
                    />
                    <div className="flex flex-col">
                        <label className="mr-2">
                            <input
                                type="radio"
                                value="publiée"
                                checked={editFormData.etat === 'publiée'}
                                onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                            />
                            Publiée
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="brouillon"
                                checked={editFormData.etat === 'brouillon'}
                                onChange={(e) => setEditFormData({ ...editFormData, etat: e.target.value })}
                            />
                            Brouillon
                        </label>
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreateNewPost}>
                            Create
                        </button>
                    </div>
                </div>
            )}
            {posts.slice().reverse().map(post => ( // Inversion de l'ordre des posts
                <div key={post.id}>
                    {post.parentPostId ? null : (
                        <div className="p-4 mb-4 border border-solid border-green-500">
                            {renderPostFamily(post)}
                            {posts.filter(comment => comment.parentPostId === post.id).map(comment => renderPostFamily(comment))}
                        </div>
                    )}
                </div>
            ))}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default ListPosts;
