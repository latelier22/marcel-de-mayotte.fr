import React from 'react';
import { toast } from "react-toastify";

// Les props devraient inclure tout état ou méthode nécessaire à la gestion depuis le parent
const AdminPanel = ({
  handleSelectAll,
  handleDeselectAll,
  handleRestoreSelection,
  lastSelection,
  numberOfPublishedPhotos,
  selectedPhotoIds,
  showModal,
  modalType,
  setModalType,
  tagCounts,
  handleTagClick
}) => {
  return (
    <div className="admin-panel" style={{ width: "20%", padding: "64px" }}>
      {/* Boutons pour la sélection des photos */}
      <div className="flex flex-row justify-around">
        <button
          className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
          onClick={handleSelectAll}
        >
          Select All ({numberOfPublishedPhotos})
        </button>
        <button
          className="rounded-md bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2"
          onClick={handleDeselectAll}
        >
          Deselect All ({selectedPhotoIds.length})
        </button>
        <button
          onClick={handleRestoreSelection}
          className={`rounded-md text-white font-bold py-2 px-4 m-2 ${
            !lastSelection.length ? "bg-neutral-200 hover:bg-neutral-200" : "bg-green-700 hover:bg-green-500 text-black"
          }`}
          disabled={!lastSelection.length}
        >
          Restore Selection ({lastSelection.length})
        </button>
      </div>

      {/* Affichage et gestion des tags */}
      <div className="tags-management">
        {Object.entries(tagCounts).map(([tag, { count, selectedCount }]) => (
          <button
            key={tag}
            className="tag-button"
            onClick={() => handleTagClick(tag)}
          >
            <div className="flex items-center justify-between w-full py-2 px-4">
              <div className="flex-grow text-center">{tag}</div>
              <div className="flex-none">
                {selectedCount || 0} / {count || 0}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal management buttons */}
      <div className="modal-buttons">
        <button
          className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
          onClick={() => { showModal('tag'); setModalType('tag'); }}
        >
          Open Tag Modal
        </button>
        <button
          className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
          onClick={() => { showModal('favorite'); setModalType('favorite'); }}
        >
          Open Favorite Modal
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
