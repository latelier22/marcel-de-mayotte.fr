// Fonction pour générer l'URL optimisée d'une image à partir de son chemin d'accès dans le répertoire public/gallerie/
function assetLink(asset, width) {
  // Construire le chemin d'accès relatif à l'image dans public/gallerie/
  const imagePath = `/gallerie/${asset}`;
  // Retourner l'URL de l'image optimisée par Next.js
  return `/gallerie/_next/image?url=${encodeURIComponent(imagePath)}&w=${width}&q=75`;
}

// Tableau de données des images avec leurs propriétés
const photos = [
  { id: 1, src: "/gallerie/image1.jpg", width: 1080, height: 780, alt: "Image 1" },
  { id: 2, src: "/gallerie/image2.jpg", width: 1080, height: 1620, alt: "Image 2" },
  { id: 3, src: "/gallerie/image3.jpg", width: 1080, height: 720, alt: "Image 3" },
  { id: 4, src: "/gallerie/image4.jpg", width: 1080, height: 720, alt: "Image 4" },
  { id: 5, src: "/gallerie/image5.jpg", width: 1080, height: 1620, alt: "Image 5" },
  { id: 6, src: "/gallerie/image6.jpg", width: 1080, height: 607, alt: "Image 6" },
  { id: 7, src: "/gallerie/image7.jpg", width: 1080, height: 608, alt: "Image 7" },
  { id: 8, src: "/gallerie/image8.jpg", width: 1080, height: 720, alt: "Image 8" },
];

export default photos;
