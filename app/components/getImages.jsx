import catalogueData from './catalogue.json';

async function getImages(limit = Infinity) {
    
        // Utilisez directement les données importées depuis le fichier JSON

   
    const tableauPhotos = catalogueData;
    console.log(tableauPhotos.slice(100,103));

    
    return tableauPhotos.slice(0, limit);
    
}
export default getImages;
