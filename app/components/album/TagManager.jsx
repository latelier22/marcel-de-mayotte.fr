import React, { useState } from 'react';
import Modal from '../Modals/Modal'; // Assurez-vous que le chemin vers le composant Modal est correct
import { toast } from 'react-toastify';

const TagManager = ({ allMyTags, setTags }) => {
    const [tagName, setTagName] = useState('');
    const [modalType, setModalType] = useState('');
    const [currentTag, setCurrentTag] = useState('');

    const handleInputChange = (e) => {
        setTagName(e.target.value);
    };

    const openModal = (type) => {
        setModalType(type);
        setCurrentTag(tagName);
    };

    const closeModal = () => {
        setModalType('');
        setTagName('');
    };

    const handleAddTag = () => {
        if (!allMyTags.includes(tagName) && tagName) {
            setTags([...allMyTags, tagName]);
            toast.success(`Tag "${tagName}" added successfully!`);
            closeModal();
        }
    };

    const handleDeleteTag = () => {
        setTags(allMyTags.filter(tag => tag !== currentTag));
        toast.success(`Tag "${currentTag}" removed successfully!`);
        closeModal();
    };

    const handleEditTag = (newTagName) => {
        if (newTagName && newTagName !== currentTag && allMyTags.includes(currentTag)) {
            const updatedTags = allMyTags.map(tag => tag === currentTag ? newTagName : tag);
            setTags(updatedTags);
            toast.success(`Tag "${currentTag}" updated to "${newTagName}"!`);
            closeModal();
        }
    };

    return (
        <div>
            <input
                type="text"
                value={tagName}
                onChange={handleInputChange}
                placeholder="Enter a tag name"
            />
            <button onClick={() => openModal('add')} disabled={allMyTags.includes(tagName)}>Add Tag</button>
            <button onClick={() => openModal('delete')} disabled={!allMyTags.includes(tagName)}>Delete Tag</button>
            <button onClick={() => openModal('edit')} disabled={!allMyTags.includes(tagName)}>Edit Tag</button>

            <Modal isOpen={modalType === 'add'} onClose={closeModal} title="Add New Tag">
                <input
                    type="text"
                    value={tagName}
                    onChange={handleInputChange}
                    placeholder="Enter new tag name"
                />
                <button onClick={handleAddTag}>Confirm Add</button>
            </Modal>

            <Modal isOpen={modalType === 'delete'} onClose={closeModal} title="Confirm Delete">
                <p>Are you sure you want to delete "{currentTag}"?</p>
                <button onClick={handleDeleteTag}>Confirm Delete</button>
            </Modal>

            <Modal isOpen={modalType === 'edit'} onClose={closeModal} title="Edit Tag">
                <input
                    type="text"
                    value={tagName}
                    onChange={handleInputChange}
                    placeholder="Enter new tag name"
                />
                <button onClick={() => handleEditTag(tagName)}>Confirm Edit</button>
            </Modal>
        </div>
    );
};

export default TagManager;
