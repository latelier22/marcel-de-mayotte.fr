import fs from 'fs';
import path from 'path';

async function getImages() {
    const dossierImages = path.join(process.cwd(), 'public', 'images', 'catalogue', 'MINI');
    const fichiers = fs.readdirSync(dossierImages);
  
    const tableauPhotos = fichiers.map((fichier) => {
      const nomFichier = path.basename(fichier, path.extname(fichier));
      const cheminRelatif = path.join( 'catalogue', 'MINI', fichier);
  
      // Extraire le numéro
      const numeroMatch = nomFichier.match(/-CAT(\d{4})-/);
      const numero = numeroMatch ? parseInt(numeroMatch[1]) : null;
  
      // Extraire les dimensions
      const dimensionsMatch = nomFichier.match(/DIM(\d+ x \d+)/);
      const dimensions = dimensionsMatch ? dimensionsMatch[1].split(' x ').map(dim => parseInt(dim)) : null;
  
      // Extraire les tags
      const tagsMatch = nomFichier.match(/TAG(.+)/);
      const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : null;
  
      // Extraire le nom d'origine
    //   const nomOriginalMatch = nomFichier.match(/MINI\/([^/]+)-CAT/);
    //     const nomOriginal = nomOriginalMatch ? nomOriginalMatch[1] : null;
  
// Extraire le nom d'origine
// Extraire le nom d'origine
const nomOriginal = nomFichier.split('IMG')[1].split('-CAT')[0];



      return {
        numero,
        dimensions: dimensions ? { largeur: dimensions[0], hauteur: dimensions[1] } : null,
        tags,
        nomFichierComplet: path.join(dossierImages, fichier),
        url: cheminRelatif,
        origin_name: nomOriginal,
      };
    });
  
    return tableauPhotos;
  }
  
  export default getImages;
  
  
  