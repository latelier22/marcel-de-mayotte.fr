import { site } from "../site";

async function getImages(limit = Infinity) {
    try {
        const url = `${site.vpsServer}/images/catalogue/catalogue.json`;

        // Récupérer les données JSON à partir de l'URL
        const response = await fetch(url, { cache: 'no-store' });

        // Vérifier si la requête a réussi
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.status}`);
        }

        // Extraire les données JSON de la réponse
        const data = await response.json();

// Remplacer "MINI" par "WEB" dans l'URL de chaque photo
const images = data.map(photo => ({
    ...photo,
    url: photo.url.replace("MINI", "WEB")
}));



        // Retourner les premières "limit" images du catalogue
        return images.slice(0, limit);
    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération des images :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}

export default getImages;
