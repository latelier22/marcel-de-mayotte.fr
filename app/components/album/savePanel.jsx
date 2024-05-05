<div className="flex flex-col" style={{ width: "20%", padding: "64px" }}>
{/* Admin-specific buttons and tag display logic here */}

<div className="flex flex-row justify-around ">
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
    !lastSelection.length
      ? "bg-neutral-200 hover:bg-neutral-200"
      : "bg-green-700 hover:bg-green-500 text-black"
  }`}
  disabled={!lastSelection.length}
>
  Restaurer la sélection ({lastSelection.length})
</button>
</div>
{Object.entries(tagStatus).map(([tag, color]) => (
<button
  className={`${color} `}
  key={tag}
  style={{ margin: "5px" }}
  onClick={() => handleTagClick(tag)}
>
  <div className="flex items-center justify-between w-full py-2 px-4">
    <div className="flex-grow text-center">{tag}</div>
    <div className="flex-none">
      {tagCounts.selectedCounts[tag] || 0} /{" "}
      {tagCounts.counts[tag] || 0}
    </div>
  </div>
</button>
))}

<div className="flex flex-row justify-around ">
<div>
<button
  className="rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
  onClick={handleToggleFavorites}
>
  <Heart isOpen={true} />
</button>

 {/* Display unused tags */}
<div className="mt-4 flex flex-wrap">
<h4 className="text-lg w-1/2 text-center font-semibold">Taags non utilsés dans la page</h4>
{unusedTags.map(tagName => (
  <button className="flex items-center flex-wrap  py-2 px-4 rounded-md text-gray-800 bg-white hover:bg-gray-100 m-2" key={tagName}
    onClick={() => handleTagClick(tagName)}>
    {tagName}
  </button>
))}
</div>




  <button onClick={handleTagModal}>Open Tag Modal</button>
  <button onClick={handleFavoriteModal}>Open Favorite Modal</button>
</div>
<FavoriteModal
  isOpen={showFavoriteModal}
  onClose={() => setShowFavoriteModal(false)}
  title="Modification des Favoris"
>
  <p>{modalContent}</p>
  <button
    className="bg-neutral-300 rounded-md p-4 m-2"
    onClick={() => applyFavoritesChange(true)}
  >
    Ajouter la sélection aux favoris
  </button>
  <button
    className="bg-neutral-300 rounded-md p-4 m-2"
    onClick={() => applyFavoritesChange(false)}
  >
    Retirer la sélection des favoris
  </button>
</FavoriteModal>
<TagModal
  isOpen={showTagModal}
  onClose={() => setShowTagModal(false)}
  title="Modification des Tags"
>
  <p>{modalContent}</p>
  <button
    className="bg-neutral-300 rounded-md p-4 m-2"
    onClick={() => applyTagChange(true)}
  >
    Ajouter ce tag à la sélection
  </button>
  <button
    className="bg-neutral-300 rounded-md p-4 m-2"
    onClick={() => applyTagChange(false)}
  >
    Retirer ce tag de la sélection
  </button>
</TagModal>

{/* \\ edit <TAgs></TAgs> */}
<div>
  <ToastContainer position="top-center" autoClose={5000} />
</div>
</div>
</div>