import React from "react";

async function ListCitations() {
  const response = await fetch("http://localhost:3976/api/citations/getCitations", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to fetch citations');
  const citations = await response.json();
  console.log(citations);

  const renderCitations = (citation, depth = 0) => {
    const subCitations = citations.filter(sub => sub.parentCitationId === citation.id);
    return (
      <div key={citation.id} className={`mb-4 p-4 pl-${depth * 4} `}>
        <p className="text-3xl ">"{citation.texte}"</p>
        <p className="text-right text-2xl italic">- {citation.auteur}</p>
        <p className="text-sm text-green-300">{citation.etat}</p>
        {subCitations.map(subCitation => renderCitations(subCitation, depth + 1))}
      </div>
    );
  };

  if (!citations || citations.length === 0) {
    return <p>Aucune citation trouvée.</p>;
  }

  return (
    <div className="container mx-auto my-8 p-4 shadow-lg rounded">
      {citations.filter(citation => !citation.parentCitationId).map(citation => (
        <div key={citation.id} className="rounded my-32 p-2 shadow-lg shadow-warning-600">
          {renderCitations(citation)}
        </div>
      ))}
    </div>
  );
}

export default ListCitations;
