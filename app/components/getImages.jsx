import fetch from 'node-fetch';
import path from 'path';


async function getImages() {
    const serverUrl = 'https:/marcel-de-mayotte.latelier22.fr'
    const url = `${serverUrl}/images/catalogue/MINI`;
    const response = await fetch(url);
    const data = await response.json();

    const entries = Object.entries(data);

    // Traitement des données récupérées
    const tableauPhotos = entries.map(([key, name]) => {
        const nomFichier = name;
        const cheminRelatif = `catalogue/MINI/${nomFichier}`;

        // Extraire le numéro
        const numeroMatch = nomFichier.match(/-CAT(\d{4})-/);
        const numero = numeroMatch ? parseInt(numeroMatch[1]) : null;

        // Extraire les dimensions
        const dimensionsMatch = nomFichier.match(/DIM(\d+ x \d+)/);
        const dimensions = dimensionsMatch ? dimensionsMatch[1].split(' x ').map(dim => parseInt(dim)) : null;

        // Extraire les tags
        const tagsMatch = nomFichier.match(/TAG(.*?)\.jpg/); // Capturer tout entre "TAG" et ".jpg"
        const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : null;

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
    }).filter(image => image.tags !== null); // Filtrer les images qui ont des tags définis

    return tableauPhotos;
}

export default getImages;
