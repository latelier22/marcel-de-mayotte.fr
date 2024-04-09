import fetch from 'node-fetch';
import path from 'path';


async function getImages(limit = 64) {
    const serverUrl = 'https:/marcel-de-mayotte.latelier22.fr'
    const url = `${serverUrl}/images/catalogue/MINI`;
    const response = await fetch(url);
    const data = await response.json();

   
    const tableauPhotos = data.map((name) => {
        const nomFichier = name;
        const cheminRelatif = `catalogue/MINI/${nomFichier}`;
    
        // Extraire le numéro
        const numeroIndex = nomFichier.indexOf('-CAT');
        const numero = numeroIndex !== -1 ? parseInt(nomFichier.slice(numeroIndex + 4, numeroIndex + 8)) : null;
    
        // Extraire les dimensions
        const dimensionsIndex = nomFichier.indexOf('DIM');
        const dimensions = dimensionsIndex !== -1 ? nomFichier.slice(dimensionsIndex + 3, dimensionsIndex + 13).split(' x ').map(dim => parseInt(dim)) : null;
    
        // Extraire les tags
        const tagsIndex = nomFichier.indexOf('TAG');
        const tags = tagsIndex !== -1 ? nomFichier.slice(tagsIndex + 3, -4).split(',').map(tag => tag.trim()) : null;
    
        // Créer l'attribut alt à partir des tags
        const alt = tags ? tags.join(', ') : 'Image sans description';
    
        return {
            numero,
            dimensions: dimensions ? { largeur: dimensions[0], hauteur: dimensions[1] } : null,
            tags,
            nomFichierComplet: cheminRelatif,
            url: cheminRelatif,
            alt: alt
        };
    });

    console.log(tableauPhotos.slice(100,300))

    
    return tableauPhotos.slice(0, limit);;
    
 
 
 
    // console.log(data);

    // const entries = Object.entries(data);
// console.log(entries)
    // Traitement des données récupérées
    // const tableauPhotos = data.map(( name) => {
    //     const nomFichier = name;
    //     const cheminRelatif = `catalogue/MINI/${nomFichier}`;

    //     // Extraire le numéro
    //     const numeroMatch = nomFichier.match(/-CAT(\d{4})-/);
    //     const numero = numeroMatch ? parseInt(numeroMatch[1]) : null;

    //     // Extraire les dimensions
    //     const dimensionsMatch = nomFichier.match(/DIM(\d+ x \d+)/);
    //     const dimensions = dimensionsMatch ? dimensionsMatch[1].split(' x ').map(dim => parseInt(dim)) : null;

    //     // Extraire les tags
    //     const tagsMatch = nomFichier.match(/TAG(.*?)\.jpg/); // Capturer tout entre "TAG" et ".jpg"
    //     const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : null;

    //     // Créer l'attribut alt à partir des tags
    //     const alt = tags ? tags.join(', ') : 'Image sans description';


    //     return {
    //         numero,
    //         dimensions: dimensions ? { largeur: dimensions[0], hauteur: dimensions[1] } : null,
    //         tags,
    //         nomFichierComplet: cheminRelatif,
    //         url: cheminRelatif,
    //         alt: alt
    //     };
    // }); // Filtrer les images qui ont des tags définis

    // return tableauPhotos;
}

export default getImages;
