"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import myFetch from '../../components/myFetch';
import EditorClient from './EditorClient'; // Ensure you import your editor correctly
import Image from 'next/image';
import Link from 'next/link';
import getBaseUrl from '../../components/getBaseUrl';
import Select from 'react-select';
import UploadFileToPost from './UploadFileToPost'; // Import the new component
import getSlug from "../../components/getSlug"

function ListPosts({ allPosts, allComments, allFiles }) {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState(allComments);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ title: '', content: '', auteur: '', etat: 'brouillon', mediaId: null, slug: '' });
    const [newCommentData, setNewCommentData] = useState({ texte: '', auteur: '', etat: 'à valider', parentPostId: null });
    const [showComments, setShowComments] = useState({});
    const [showNewCommentForm, setShowNewCommentForm] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [lastModifiedPostId, setLastModifiedPostId] = useState(null);
    const [images, setImages] = useState(allFiles);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');

    const { data: session } = useSession();


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const initialPosts = groupPosts(allPosts, allComments);
        setPosts(initialPosts);
        console.log(initialPosts)
    }, [allComments, allPosts]);

    const groupPosts = (posts, comments) => {
        if (!Array.isArray(comments)) return posts;
        return posts.map(post => ({
            ...post,
            comments: comments.filter(comment => comment.post === post.id).map(comment => comment.id)
        }));
    };

    const generateSlug = (title) => {
        return getSlug(title)
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/-+/g, '-'); // Replace multiple - with single -
    };

    const handleImageChange = (selectedOption) => {
        const newMediaId = selectedOption ? selectedOption.value : null;
        setEditFormData({ ...editFormData, mediaId: newMediaId });
        setSelectedImageUrl(newMediaId ? images.find(img => img.id === newMediaId).url : '');
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setSelectedPost(null);
            setEditing(false);
            setCreatingNew(false);
        }
    };

    const handlePostClick = (post) => {
        if (!editing && !creatingNew) {
            setSelectedPost(post);
            const mediaId = post.medias && post.medias.data && post.medias.data.length > 0 ? post.medias.data[0].id : null;
            const mediaUrl = mediaId ? post.medias.data[0].attributes.url : '';
            setEditFormData({ title: post.title, content: post.content, auteur: post.auteur, etat: post.etat, mediaId: mediaId, slug: post.slug });
            setSelectedImageUrl(mediaUrl);
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
        if (!editFormData.mediaId) {
            setError('Please select a media.');
            return;
        }
        const payload = {
            data: {
                ...editFormData,
                medias: { id: editFormData.mediaId }
            }
        };
        try {
            await myFetch(`/api/posts/${selectedPost.id}`, 'PUT', payload);
            // Faire une nouvelle requête pour récupérer le post mis à jour avec les médias peuplés
            const response = await myFetch(`/api/posts/${selectedPost.id}?populate=*`, 'GET');
            const updatedPost = { id: response.data.id, ...response.data.attributes };
            const mediaUrl = updatedPost.medias && updatedPost.medias.data && updatedPost.medias.data.length > 0 
                ? updatedPost.medias.data[0].attributes.url 
                : '';
            const updatedPosts = posts.map(post => post.id === updatedPost.id ? { ...updatedPost, imageUrl: mediaUrl } : post);
            setPosts(updatedPosts); // Mise à jour de l'état des posts
            setEditing(false);
            setLastModifiedPostId(updatedPost.id);
            setSelectedImageUrl(mediaUrl); // Mise à jour de l'image
            setSelectedPost(updatedPost); // Mettre à jour le post sélectionné pour montrer le post édité
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
        if (!editFormData.title || !editFormData.content || !editFormData.auteur || !editFormData.mediaId) {
            setError('Please fill all fields and select a media for the new post.');
            return;
        }
        const payload = {
            data: {
                ...editFormData,
                slug: generateSlug(editFormData.title), // Generate slug from title
                medias: { id: editFormData.mediaId }
            }
        };
        try {
            const response = await myFetch('/api/posts', 'POST', payload);
            const newPostId = response.data.id;
    
            // Faire une nouvelle requête pour récupérer le post créé avec les médias peuplés
            const newPostResponse = await myFetch(`/api/posts/${newPostId}?populate=*`, 'GET');
            const newPost = {
                id: newPostResponse.data.id,
                slug : newPostResponse.data.slug,
                imageUrl: newPostResponse.data.attributes.medias && newPostResponse.data.attributes.medias.data && newPostResponse.data.attributes.medias.data.length > 0
                    ? newPostResponse.data.attributes.medias.data[0].attributes.url
                    : null,
                title: newPostResponse.data.attributes.title,
                content: newPostResponse.data.attributes.content,
                auteur: newPostResponse.data.attributes.auteur,
                etat: newPostResponse.data.attributes.etat,
                createdAt: newPostResponse.data.attributes.createdAt,
                updatedAt: newPostResponse.data.attributes.updatedAt,
                publishedAt: newPostResponse.data.attributes.publishedAt,
                comments: newPostResponse.data.attributes.comments && newPostResponse.data.attributes.comments.data
                    ? newPostResponse.data.attributes.comments.data.map(comment => comment.id)
                    : []
            };
    
            const mediaUrl = newPost.imageUrl || '';
            setPosts([newPost, ...posts]);
            setLastModifiedPostId(newPost.id);
            setCreatingNew(false);
            setEditFormData({ title: '', content: '', auteur: '', etat: 'brouillon', mediaId: null, slug: '' });
            setSelectedImageUrl(mediaUrl); // Mise à jour de l'image
            setSelectedPost(newPost); // Mettre à jour le post sélectionné pour montrer le nouveau post
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
            const findAllChildIds = (id, allComments) => {
                let childIds = allComments.filter(comment => comment.parent_comment === id).map(comment => comment.id);
                return childIds.reduce((acc, childId) => acc.concat(childId, findAllChildIds(childId, allComments)), []);
            };

            const idsToDelete = [commentId, ...findAllChildIds(commentId, comments)];

            for (const id of idsToDelete) {
                await myFetch(`/api/comments/${id}`, 'DELETE');
            }

            setComments(prevComments => prevComments.filter(comment => !idsToDelete.includes(comment.id)));

            setPosts(prevPosts => prevPosts.map(post => {
                return {
                    ...post,
                    comments: post.comments.filter(id => !idsToDelete.includes(id))
                };
            }));

            setSelectedPost(myPost);
            setLastModifiedPostId(myPost.id);

            setError('');
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

            setComments(prevComments => {
                const updatedComments = [...prevComments, addedComment];

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
                    <Link className="bg-green-500 text-white px-4 py-2 rounded" href={`/blog/${generateSlug(post.title)}`}>Lire</Link>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleEditPost}>Edit</button>
                    <button className={`text-white px-4 py-2 rounded ${hasComments ? 'bg-neutral-600' : 'bg-red-500'}`} onClick={() => handleDeletePost(post.id)} disabled={hasComments}>Delete</button>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => handleAddComment(post)}>Add Comment</button>
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

    const imageOptions = images.slice().reverse().map(image => {
        const baseUrl = getBaseUrl(image.url);
        const thumbnailUrl = image.formats && image.formats.thumbnail ? `${baseUrl}${image.formats.thumbnail.url}` : `${baseUrl}${image.url}`;
        return {
            value: image.id,
            label: (
                <div className="flex items-center">
                    <img src={thumbnailUrl} alt={image.name} width={50} height={50} className="object-cover mr-2" />
                    <span>{image.name}</span>
                </div>
            ),
        };
    });

    const renderComments = (commentIds, allComments, post) => {
        const rootComments = commentIds.map(id => allComments.find(c => c.id === id && !c.parent_comment));
        return rootComments.map(comment => comment ? renderCommentTree(comment, allComments, post) : null);
    };

    const renderPostFamily = (post) => {
        const hasComments = post.comments && post.comments.length > 0;
        const commentCount = hasComments ? post.comments.length : 0;
        const baseURL = selectedImageUrl ? getBaseUrl(selectedImageUrl) : post.imageUrl && getBaseUrl(post.imageUrl);
        const fullImageUrl = post === selectedPost && selectedImageUrl
            ? `${baseURL}${selectedImageUrl}`
            : post.medias && post.medias.data && post.medias.data.length > 0
                ? `${getBaseUrl(post.medias.data[0].attributes.url)}${post.medias.data[0].attributes.url}`
                : `https://placehold.co/600x400/EECC44/000000/png?font=monserrat&text=${encodeURIComponent(post.title)}`;

        return (
            <div key={post.id} className={`p-4 mb-4 flex flex-col md:flex-row items-center cursor-pointer ${post.id === lastModifiedPostId ? 'bg-yellow-200' : ''} ${post === selectedPost ? 'border-green-500 border-solid border-2' : ''}`} onClick={() => handlePostClick(post)}>
                <div className='' style={{ minWidth: '15vw' }}>
                    <Image
                        src={fullImageUrl}
                        className={`mb-5 w-96 h-96 object-cover object-center`}
                        
                        width="300"
                        height="300"
                        alt="blog"
                        priority
                    />
                </div>
                {editing && post === selectedPost ? (
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Titre"
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value, slug: generateSlug(e.target.value) })}
                            className="p-2 border rounded"
                        />
                        <Select
                            options={imageOptions}
                            onChange={handleImageChange}
                            value={imageOptions.find(option => option.value === editFormData.mediaId)}
                            isClearable
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

    const handleFileUpload = (newFiles) => {
        setImages((prevImages) => [...prevImages, ...newFiles]);
    };

    return (
        <div ref={containerRef} className="container bg-yellow-100 text-red-900 mx-auto my-8 p-4 shadow-lg rounded">
            {creatingNew ? (
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value, slug: generateSlug(e.target.value) })}
                        className="p-2 border rounded"
                    />
                    <Select
                        options={imageOptions}
                        onChange={handleImageChange}
                        value={imageOptions.find(option => option.value === editFormData.mediaId)}
                        isClearable
                    />
                    <UploadFileToPost onFileUpload={handleFileUpload} /> {/* Add the component here */}
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
                <button onClick={() => {
                    setCreatingNew(true);
                    setEditFormData({ title: '', content: '', auteur: session?.user?.email || 'entrer email', etat: 'brouillon', mediaId: null, slug: '' });
                    setSelectedPost(null);
                }} className="bg-lime-500 px-4 py-2 rounded mb-4">AJOUTER UN ARTICLE</button>
            )}

            <div ref={containerRef} className="container bg-yellow-100 text-red-900 mx-auto my-8 p-4 shadow-lg rounded">
                {!creatingNew && !editing && posts.map(post => renderPostFamily(post))}
                {(creatingNew || editing) && selectedPost && renderPostFamily(selectedPost)}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default ListPosts;
