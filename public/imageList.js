const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'RECENTS1');

// Fonction pour lire le répertoire et générer le JSON
function generateImageList() {
    fs.readdir(directoryPath, function (err, files) {
        // Gérer l'erreur s'il y en a une
        if (err) {
            console.log('Unable to scan directory: ' + err);
            return;
        }
        
        // Filtrer pour ne garder que les fichiers images (suppose des jpg pour l'exemple)
        const imageFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpg');

        // Créer un tableau d'objets avec le nom et le chemin de chaque image
        const imageList = imageFiles.map(file => ({
            name: file,
            src: `/RECENTS1/${file}`
        }));

        // Écrire le résultat dans un fichier JSON
        fs.writeFile('imageList.json', JSON.stringify(imageList, null, 4), err => {
            if (err) {
                console.log('Error writing file:', err);
            } else {
                console.log('File has been saved.');
            }
        });
    });
}

// Exécuter la fonction
generateImageList();
