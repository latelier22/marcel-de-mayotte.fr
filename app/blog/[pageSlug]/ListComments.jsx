"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import myFetch from "../../components/myFetch";
import Modal from '../../components/Modals/Modal'; // Assurez-vous que le chemin est correct

const ListComments = ({ post, postComments }) => {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [textInputs, setTextInputs] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingToId, setReplyingToId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    initializeComments(postComments);
  }, [postComments]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setEditingCommentId(null);
      setReplyingToId(null);
    }
  };

  const initializeComments = (comments) => {
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, child_comments: [] };
      if (comment.parent_comment) {
        if (commentMap[comment.parent_comment]) {
          commentMap[comment.parent_comment].child_comments.push(commentMap[comment.id]);
        } else {
          commentMap[comment.parent_comment] = { child_comments: [commentMap[comment.id]] };
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    setComments(rootComments);
  };

  const handleReply = (commentId) => {
    if (status !== 'authenticated') {
      setShowModal(true);
      return;
    }
    setReplyingToId(commentId);
    setEditingCommentId(null);
  };

  const handleEdit = (commentId) => {
    const commentToEdit = findCommentById(comments, commentId);
    if (commentToEdit) {
      setEditingCommentId(commentId);
      setReplyingToId(null);
      setTextInputs(prev => ({ ...prev, [commentId]: commentToEdit.texte }));
    }
  };

  const findCommentById = (comments, id) => {
    for (let comment of comments) {
      if (comment.id === id) {
        return comment;
      }
      const childComment = findCommentById(comment.child_comments, id);
      if (childComment) {
        return childComment;
      }
    }
    return null;
  };

  const handleInputChange = (e, commentId) => {
    setTextInputs(prev => ({ ...prev, [commentId]: e.target.value }));
  };

  const addComment = async (text, parentCommentId = null) => {
    if (!text.trim() || !session) return;

    const payload = {
      data: {
        texte: text,
        auteur: session.user.email,
        post: post.id,
        parent_comment: parentCommentId,
        etat: 'à valider'
      }
    };

    const response = await myFetch('/api/comments', 'POST', payload);
    const newComment = {
      id: response.data.id,
      texte: response.data.attributes.texte,
      auteur: response.data.attributes.auteur,
      etat: response.data.attributes.etat,
      child_comments: [],
      parent_comment: parentCommentId
    };

    setComments(prevComments => {
      if (parentCommentId) {
        const updatedComments = addReplyToComments(prevComments, parentCommentId, newComment);
        return updatedComments;
      }
      return [...prevComments, newComment];
    });
    setReplyingToId(null);
    setNewCommentText(''); // Réinitialiser le texte du nouveau commentaire
  };

  const addReplyToComments = (comments, parentId, newComment) => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, child_comments: [...comment.child_comments, newComment] };
      } else if (comment.child_comments.length > 0) {
        return { ...comment, child_comments: addReplyToComments(comment.child_comments, parentId, newComment) };
      }
      return comment;
    });
  };

  const saveEditedComment = async (commentId) => {
    const newText = textInputs[commentId];
    if (!newText.trim()) return;

    const payload = {
      data: {
        texte: newText,
        etat: 'à valider' // Assuming all edits require re-validation
      }
    };

    await myFetch(`/api/comments/${commentId}`, 'PUT', payload);
    const updatedComments = updateCommentText(comments, commentId, newText);
    setComments(updatedComments);
    setEditingCommentId(null);
    setTextInputs({});
  };

  const updateCommentText = (comments, id, newText) => {
    return comments.map(comment => {
      if (comment.id === id) {
        return { ...comment, texte: newText };
      } else if (comment.child_comments.length > 0) {
        return { ...comment, child_comments: updateCommentText(comment.child_comments, id, newText) };
      }
      return comment;
    });
  };

  const renderCommentTree = (comment) => {
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingToId === comment.id;
    const canEdit = (comment.auteur === session?.user?.email) && (comment.etat === "à valider");

    return (
      <div key={comment.id} className="mt-2 border-r-2 border-gray-400 pr-4">
        <div className={`text-right ${comment.etat === 'à valider' ? 'text-gray-500 italic' : 'text-black'}`}>
          {isEditing ? (
            <textarea
              value={textInputs[comment.id] || ''}
              onChange={(e) => handleInputChange(e, comment.id)}
              className="text-black w-full p-2 border rounded"
            />
          ) : (
            <>
              <p className="text-lg">{comment.texte}</p>
              <p className="text-sm font-bold">— {comment.auteur} {comment.etat === 'à valider' && '(en attente de validation)'}</p>
            </>
          )}
          <div className="flex space-x-2 justify-end">
            {isEditing ? (
              <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => saveEditedComment(comment.id)}>
                Save
              </button>
            ) : (
              <>
                {canEdit && (
                  <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(comment.id)}>
                    Edit
                  </button>
                )}
                {comment.etat === 'validée' && (
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleReply(comment.id)}>
                    Reply
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        {isReplying && (
          <div className="flex flex-col mt-2">
            <textarea
              placeholder="Reply to comment..."
              className="w-full text-black p-2 border rounded"
              value={textInputs[replyingToId] || ''}
              onChange={(e) => handleInputChange(e, replyingToId)}
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded mt-2 self-end" onClick={() => addComment(textInputs[replyingToId], comment.id)}>
              Save Reply
            </button>
          </div>
        )}
        {comment.child_comments.map(childComment => renderCommentTree(childComment))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className='bg-yellow-200'>
      <h3>Comments</h3>
      {comments.map(comment => renderCommentTree(comment))}
      {session && !editingCommentId && !replyingToId && (
        <div className='flex flex-col items-end'>
          <textarea
            placeholder="Add a comment..."
            className="w-full text-black mt-8 p-2 border rounded"
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={() => addComment(newCommentText)}>
            Save Comment
          </button>
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Connexion requise">
        <p>Vous devez être connecté pour répondre à un commentaire.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={() => signIn({ callbackUrl: window.location.href })}
        >
          Se connecter
        </button>
      </Modal>
    </div>
  );
};

export default ListComments;
