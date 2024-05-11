"use client"
import React, { useState, useRef, useEffect } from 'react';

function ListCitations({ allCitations }) {
    const [citations, setCitations] = useState(allCitations);
    const [selectedCitation, setSelectedCitation] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({ texte: '', auteur: '', etat: 'brouillon' });
    const [newChildData, setNewChildData] = useState({ texte: '', auteur: '', etat: 'brouillon', parentCitationId: null });
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const [creatingNew, setCreatingNew] = useState(false);
    const [lastModifiedCitationId, setLastModifiedCitationId] = useState(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelectedCitation(null);
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
        const groupCitations = (citations) => {
            const parentMap = {};
            citations.forEach(citation => {
                if (citation.parentCitationId) {
                    parentMap[citation.parentCitationId] = parentMap[citation.parentCitationId] || [];
                    parentMap[citation.parentCitationId].push(citation);
                } else {
                    parentMap[citation.id] = parentMap[citation.id] || [];
                    parentMap[citation.id].unshift(citation); // Ensure parent is first
                }
            });
            return Object.values(parentMap).flat();
        };
        setCitations(groupCitations(allCitations));
    }, [allCitations]);

    const handleCitationClick = (citation) => {
        if (!editing) {
            setSelectedCitation(citation);
            setEditFormData({ texte: citation.texte, auteur: citation.auteur, etat: citation.etat });
        }
    };

    const handleEditCitation = () => {
        setEditing(true);
    };

    const handleUpdateCitation = async () => {
        if (!selectedCitation) {
            setError('No citation selected for updating.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3976/api/citations/updateCitation/${selectedCitation.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });

            if (!response.ok) throw new Error('Failed to update citation');

            const data = await response.json();
            const updatedCitation = data.citation;
            console.log("UPDATED CITATION", updatedCitation)

            const updatedCitations = citations.map(citation =>
                citation.id === updatedCitation.id ? { ...citation, ...editFormData } : citation
            );
            setCitations(updatedCitations);
            setEditing(false);
            setLastModifiedCitationId(updatedCitation.id);
            setSelectedCitation(null);
        } catch (error) {
            console.error(`An error occurred while updating citation:`, error);
            setError('Failed to update citation due to a network error');
        }
    };

    const handleAddChild = (parentCitation) => {
        console.log("reset");
        setNewChildData({ texte: '', auteur: '', etat: 'brouillon', parentCitationId: parentCitation.id });
    };

    const handleSaveNewChild = async () => {
        if (!newChildData.texte || !newChildData.auteur) {
            setError('Please fill all fields for the new citation.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3976/api/citations/createCitation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newChildData)
            });

            if (!response.ok) throw new Error('Failed to add new child citation');

            const data = await response.json();
            const addedCitation = data.citation;
            let newCitations = [...citations];
            // Find the last child of this parent to insert the new child after
            const parentChildren = newCitations.filter(c => c.parentCitationId === newChildData.parentCitationId);
            let insertIndex = newCitations.findIndex(c => c.id === newChildData.parentCitationId);
            if (parentChildren.length > 0) {
                const lastChild = parentChildren[parentChildren.length - 1];
                insertIndex = newCitations.indexOf(lastChild) + 1;
            } else {
                insertIndex += 1; // If no children, insert after the parent
            }
            addedCitation.parentCitationId = newChildData.parentCitationId; // Ensure it has the correct parent ID
            newCitations.splice(insertIndex, 0, addedCitation);
            setLastModifiedCitationId(addedCitation.id);
            setCitations(newCitations);
            setNewChildData({ texte: '', auteur: '', etat: 'brouillon', parentCitationId: null }); // Reset form data
            setSelectedCitation(null);
        } catch (error) {
            console.error(`An error occurred while adding a new child citation:`, error);
            setError('Failed to add new child citation due to a network error');
        }
    };

    const handleDeleteCitation = async () => {
        if (!selectedCitation) {
            setError('No citation selected for deletion.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3976/api/citations/deleteCitation/${selectedCitation.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to delete citation');

            const updatedCitations = citations.filter(c => c.id !== selectedCitation.id);
            setCitations(updatedCitations);
            setSelectedCitation(null);
        } catch (error) {
            console.error(`An error occurred while deleting citation:`, error);
            setError('Failed to delete citation due to a network error');
        }
    };

    const handleCreateNewCitation = async () => {
        if (!editFormData.texte || !editFormData.auteur) {
            setError('Please fill all fields for the new citation.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3976/api/citations/createCitation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });

            if (!response.ok) throw new Error('Failed to create new citation');

            const data = await response.json();
            const addedCitation = data.citation
            console.log("CREATED CITATION", addedCitation)
            setCitations([...citations, addedCitation]);
            setLastModifiedCitationId(addedCitation.id);
            setCreatingNew(false);
            setEditFormData({ texte: '', auteur: '', etat: '' });
        } catch (error) {
            console.error(`An error occurred while creating a new citation:`, error);
            setError('Failed to create new citation due to a network error');
        }
    };




    const renderCitationFamily = (citation) => {
        // Determine if the citation has children
        const hasChildren = citations.some(child => child.parentCitationId === citation.id);

        return (
            <div key={citation.id} className={`p-4 mb-4 cursor-pointer ${citation.id === lastModifiedCitationId ? 'bg-gray-800' : ''} ${citation === selectedCitation ? 'border-green-500 border-solid border-2' : ''}`} onClick={() => handleCitationClick(citation)}>
                {editing && citation === selectedCitation ? (
                    <div className="flex flex-col">
                        <input className="flex flex-col bg-black p-4 " type="text" value={editFormData.texte} onChange={e => setEditFormData({ ...editFormData, texte: e.target.value })} />
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
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpdateCitation}>Save</button>
                    </div>
                ) : (
                    <div>
                        <p className="text-3xl">"{citation.texte}"</p>
                        <p className="text-right text-2xl italic">- {citation.auteur}</p>
                        <p className="text-sm text-green-300">{citation.etat}</p>
                        {citation === selectedCitation && (
                            <>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleEditCitation}>Edit</button>
                                <button className={`${hasChildren ? 'bg-neutral-600' : 'bg-red-500'
                                    } text-white px-4 py-2 rounded`} onClick={handleDeleteCitation} disabled={hasChildren}>Delete</button>
                                {!citation.parentCitationId && <button className="bg-blue-300 text-white px-4 py-2 rounded" onClick={() => handleAddChild(citation)}>Add Child</button>}
                            </>
                        )}
                    </div>
                )}
                {selectedCitation === citation && newChildData.parentCitationId === citation.id && (
                    <div className="flex flex-col bg-black p-4 border-l-4 border-green-500 ml-4">
                        <input className="flex flex-col bg-black p-4 " type="text" placeholder="Texte" value={newChildData.texte} onChange={e => setNewChildData({ ...newChildData, texte: e.target.value })} />
                        <input className="flex flex-col bg-black p-4 " type="text" placeholder="Auteur" value={newChildData.auteur} onChange={e => setNewChildData({ ...newChildData, auteur: e.target.value })} />
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
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSaveNewChild}>Save New Child</button>
                    </div>
                )}
            </div>
        );
    };


    return (
        <div ref={containerRef} className="container mx-auto my-8 p-4 shadow-lg rounded">
            <button onClick={() => setCreatingNew(true)} disabled={selectedCitation} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
                Create New Citation
            </button>
            {creatingNew && (
                <div className="new-citation-form p-4 border border-gray-300 rounded">
                    <input
                        className="flex w-full flex-col bg-black p-4 "
                        type="text"
                        placeholder="Saisir votre citation"
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
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreateNewCitation}>
                            Create
                        </button>
                    </div>
                </div>
            )}
            {citations.slice().reverse().map(citation => ( // Inversion de l'ordre des citations
                <div key={citation.id}>
                    {citation.parentCitationId ? null : (
                        <div className="p-4 mb-4 border border-solid border-green-500">
                            {renderCitationFamily(citation)}
                            {citations.filter(child => child.parentCitationId === citation.id).map(child => renderCitationFamily(child))}
                        </div>
                    )}
                </div>
            ))}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default ListCitations;
