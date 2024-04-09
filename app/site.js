export const site = {
  title: "Liberté Egalité Magnégné",
  description: "Artiste peintre de Mayotte - Marcel Séjour - 0639676875",
  societe: "Association",
  SIRET: "",
  contact: "Marcel SEJOUR",
  telephone: "0639676875",
  adresse: "22 rue Baboussalama",
  adresse2 : "Cavani Mtsapéré",
  codePostal: "97600",
  ville: "MAMOUDZOU",
  email: "contact@marcel-de-mayotte.fr",
  logo: { url: "/images/logo-barre-du-haut.png", alt: "logo Marcel Séjour" },
  Logo: { url: "/images/logo-banniere.png", alt: "logo logo Marcel Séjour" },
  facebook :"https://www.facebook.com/profile.php?id=100010085468800"
};

export const menuItems = [
  { label: "Accueil", route: "/" },
  // { label: "Actualités", route: "/actualites" },
  { label: "Galerie", route: "/galerie" },
  { label: "Catalogue complet", route: "/catalogue" },
  // { label: "Expositions", route: "/expositions" },
  // { label: "Produits dérivés", route: "/boutique" },
  { label: "Livres", route: "/livre" },
  { label: "Vidéos", route: "/video" },

  { label: "Blog", route: "https://liberteegalitemagnegne.fr/" },
  { label: "Contact", route: "/contact" },
];

export const cards = [
 


  {
    title: "NOS REALISATIONS",
    text: "",
    button: "",
    buttonColor: "bg-gold-500",
    link: "/realisations",
    url: "menu-peinture-exterieure.png",
    alt: "",
  },
];

export const cards2 = [
 
];

export const sections = [
  {
    title: "Qui suis-je?",
    body: "Marcel Séjour, né à Angers le 9 juillet 1948. Etudes secondaires à Angers, puis Sup de Co à Nantes. Vit en Australie de 1972 à1987,\
    y découvre, à trente ans, le dessin et la peinture, et décide alors qu’il ne fera plus que ça. Bref passage en France de 1987 à 1993 ; licence d’Anglais, puis CAPES,\
      puis en poste à Stenay dans la Meuse. Direction Mayotte, en 1993. Séduction immédiate pour les couleurs, la lumière, les peaux noires et la rusticité.\
      Retour en métropole en 2021 et tentative d’installation pour raisons familiales, et pour préparer une exposition dont Mayotte serait le thème.\
      Echec de la tentative et retour à Mayotte en juin 2022. Ré installation et retour probablement définitifs. Exposition en France prévue pour 2026. Si le Ciel l’entend ainsi.",
  },
  {
    title: " NOS SAVOIRS FAIRE",
    body: (
      <ul className="list-disc pl-4">
        <li></li>
        <li></li>
      </ul>
    ),
  },
];

export const listesActions = [
  {
    title: "ACTUALITES",
    subTitle: "",
    photo: { url: "Rectangle_8.png", alt: "" },
    actions: [""],
  },
  {
    title: "GALERIE",
    subTitle: "",
    photo: { url: "", alt: "" },
    actions: ["", "", ""],
  },
  {
    title: "BOUTIQUE",
    subTitle: "",
    photo: { url: "", alt: "" },
    actions: ["", "", ""],
  },

  {
    title: "EXPOSITIONS",
    subTitle: "",
    photo: { url: "", alt: "" },
    actions: [""],
  },
  {
    title: "BLOG",
    subTitle: "",
    photo: { url: "", alt: "" },
    actions: [""],
  },
  
];
export const photos = [
  {url : "voule-sur-la-plage.jpg",
  alt: "voule sur la plage"}
]

export const Pages = {
  actualites: {
    title: "Actualités",
    description: "",
    photos: [
      { url: "actualites-1.png", alt: "gallery" },
      { url: "actualites-2.png", alt: "gallery" },
      { url: "actualites-3.png", alt: "gallery" },
      { url: "actualites-4.png", alt: "gallery" },
    ],
    sections: [
      {
        title: "LES PROJETS :",
        body: (
          <ul className="list-disc text-gold-400 pl-4">
            <li> Projet à court terme </li>
            <li> Projet à moyen terme </li>
            <li> Projet à long terme </li>
          </ul>
        ),
      },
    ],
    cards: [],
  },
  livres: {
    title: "Livres",
    description: "Les livres de Marcel Séjour, artiste peintre et écrivain",
    photos: [
      { url: "livre-1.png", alt: "Livre épuisé" },
      { url: "livre-2.png", alt: "Liberté, Egalité, Magnégné: beau livre d'art" },
      { url: "livre-3.png", alt: "Mayotte, livret 64 pages, carré" },
      { url: "livre-4.png", alt: "Une île, deux regards - Marcel Séjour & Nicolas FRAISSE" },
    ],
    sections: [
      {
        title: "Livre en cours d'écriture : Les mémoires de Marcel Séjour",
        body: (
          <ul className="list-disc text-gold-400 pl-4">
            <li> Préface </li>
            <li> Chapitre 1 </li>
            <li> A suivre </li>
          </ul>
        ),
      },
    ],
    cards: [
      {
        title: "Mémoires d'un artiste Magnégné",
        text: "En cours d'écriture",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/5",
        url: "livre-5.png",
        alt: "Mémoires de Marcel Séjour",
        nbPages :"18",
        bookHeight :"600",
        bookWidth :"424"
      },

      {
        title: "Une île, deux regards",
        text: "Marcel Séjour & Nicolas FRAISSE",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/4",
        url: "livre-4.png",
        alt: "Une île, deux regards",
        nbPages :"76",
        bookHeight :"600",
        bookWidth :"476"
      },
      {
        title: "Mayotte",
        text: "Marcel Séjour- livret 64 pages, carré",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/3",
        url: "livre-3.png",
        alt: "Mayotte",
        nbPages :"64",
        bookHeight :"600",
        bookWidth :"600"
      },
     
      {
        title: "Liberté, Egalité, Magnégné",
        text: "Marcel Séjour - Beau livre d'art",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/2",
        url: "livre-2.png",
        alt: "Liberté, Egalité, Magnégné",
        nbPages :"417",
        bookHeight :"661",
        bookWidth :"512"
      },
      {
        title: "Portraits de Mayotte... et d'Anjouan",
        text: "Livre épuisé",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/1",
        url: "livre-1.png",
        alt: "Livre épuisé",
        nbPages :"16",
        bookHeight :"600",
        bookWidth :"600"
      },
      
      
    ]
  },
  videos: {
    title: "Vidéos",
    description: "Vidéos, reportages et interview de Marcel Séjour",
    photos: [
      { url: "livre-1.png", alt: "Livre épuisé" },
      { url: "livre-2.png", alt: "Liberté, Egalité, Magnégné: beau livre d'art" },
      { url: "livre-3.png", alt: "Mayotte, livret 64 pages, carré" },
      { url: "livre-4.png", alt: "Une île, deux regards - Marcel Séjour & Nicolas FRAISSE" },
    ],
    sections: [
      {
        title: "",
        body: (
          <ul className="list-disc text-gold-400 pl-4">
            <li>  </li>
            <li>  </li>
            <li>  </li>
          </ul>
        ),
      },
    ],
    cards: [
      {
        title: "Interview dans son atelier de Marcel Séjour",
        text: "15min",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/1",
        url: "video-1.png",
        alt: "Interview de Marcel Séjour",
      },
      {
        title: "Des élèves du lycée de Mamoudzou Nord rencontrent le peintre Marcel Séjour",
        text: "2min41",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/2",
        url: "video-2.png",
        alt: "Des élèves du lycée de Mamoudzou Nord rencontrent le peintre Marcel Séjour",
      },
      {
        title: "Marcel Séjour, artiste peintre, nous parle de sa dernière création. Mayotte, le 20 octobre",
        text: "2min15",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/3",
        url: "video-3.png",
        alt: "Marcel Séjour, artiste peintre, nous parle de sa dernière création. Mayotte, le 20 octobre",
      },
      {
        title: "Art_ Lancement de la marque Marcel Séjour.",
        text: "1m29",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/4",
        url: "video-4.png",
        alt: "Art_ Lancement de la marque Marcel Séjour.",
      },
      {
        title: "Le confinement de Marcel Séjour.",
        text: "1m29",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/5",
        url: "video-5.png",
        alt: "Confinement",
      },
      {
        title: "Emission TV Place publique",
        text: "1m29 - Mayotte Première - 08/11/2017",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/6",
        url: "video-6.png",
        alt: "Art_ Lancement de la marque Marcel Séjour.",
      },
      {
        title: "Emission Témoins d'outre-mer: La peinture de Marcel Séjour",
        text: "3m06 - LTOM - 16/03/2020",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/7",
        url: "video-7.png",
        alt: "La peinture de Marcel Séjour",
      },
      {
        title: "CULTURE 1ère avec Melade Jean Paul et ses invités : Le peintre mahorais, Marcel Sejour, sort un livre sur ses 25 ans de peinture (liberté, égalité, magnégné)",
        text: "3m06 - Réunion la 1èere - 30/11/2017",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/video/8",
        url: "video-8.png",
        alt: "Le peintre mahorais, Marcel Sejour, sort un livre sur ses 25 ans de peinture (liberté, égalité, magnégné)",
      },

  

      
    ]
  },
  blog: {
    title: "Blog",
    description: "Les articles des différents blog de Marcel Séjour",
    photos: [
      { url: "livre-1.png", alt: "Livre épuisé" },
      { url: "livre-2.png", alt: "Liberté, Egalité, Magnégné: beau livre d'art" },
      { url: "livre-3.png", alt: "Mayotte, livret 64 pages, carré" },
      { url: "livre-4.png", alt: "Une île, deux regards - Marcel Séjour & Nicolas FRAISSE" },
    ],
    sections: [
      {
        title: "Livre en cours d'écriture : Les mémoires de Marcel Séjour",
        body: (
          <ul className="list-disc text-gold-400 pl-4">
            <li> Préface </li>
            <li> Chapitre 1 </li>
            <li> A suivre </li>
          </ul>
        ),
      },
    ],
    cards: [
      {
        title: "Mémoires d'un artiste Magnégné",
        text: "En cours d'écriture",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/5",
        url: "livre-5.png",
        alt: "Mémoires de Marcel Séjour",
        nbPages :"18",
        bookHeight :"600",
        bookWidth :"424"
      },

      {
        title: "Une île, deux regards",
        text: "Marcel Séjour & Nicolas FRAISSE",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/4",
        url: "livre-4.png",
        alt: "Une île, deux regards",
        nbPages :"76",
        bookHeight :"600",
        bookWidth :"476"
      },
      {
        title: "Mayotte",
        text: "Marcel Séjour- livret 64 pages, carré",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/3",
        url: "livre-3.png",
        alt: "Mayotte",
        nbPages :"64",
        bookHeight :"600",
        bookWidth :"600"
      },
     
      {
        title: "Liberté, Egalité, Magnégné",
        text: "Marcel Séjour - Beau livre d'art",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/2",
        url: "livre-2.png",
        alt: "Liberté, Egalité, Magnégné",
        nbPages :"417",
        bookHeight :"661",
        bookWidth :"512"
      },
      {
        title: "Portraits de Mayotte... et d'Anjouan",
        text: "Livre épuisé",
        button: "",
        buttonColor: "bg-gold-500",
        link: "/livre/1",
        url: "livre-1.png",
        alt: "Livre épuisé",
        nbPages :"16",
        bookHeight :"600",
        bookWidth :"600"
      },
      
      
    ]
  },
  "galerie": {
    title: "galerie",
    description: "",
    photos: [
      { url: "galerie-01-1.jpg", alt: "Image 1" },
      { url: "galerie-01-2.jpg", alt: "Image 2" },
      { url: "galerie-01-3.jpg", alt: "Image 3" },
      { url: "galerie-01-4.jpg", alt: "Image 4" },
      { url: "galerie-01-5.jpg", alt: "Image 5" },
      { url: "galerie-01-6.jpg", alt: "Image 6" },
      { url: "galerie-01-7.jpg", alt: "Image 7" },
      { url: "galerie-01-8.jpg", alt: "Image 8" },
      { url: "galerie-01-9.jpg", alt: "Image 9" },
      { url: "galerie-01-10.jpg", alt: "Image 10" },
      { url: "galerie-01-11.jpg", alt: "Image 11" },
      // { url: "galerie-01-12.jpg", alt: "Image 12" },
      { url: "galerie-01-13.jpg", alt: "Image 13" },
      { url: "galerie-01-14.jpg", alt: "Image 14" },
      { url: "galerie-01-15.jpg", alt: "Image 15" },
      { url: "galerie-01-16.jpg", alt: "Image 16" },
      { url: "galerie-01-17.jpg", alt: "Image 17" },
      { url: "galerie-01-18.jpg", alt: "Image 18" },
      { url: "galerie-01-19.jpg", alt: "Image 19" },
      { url: "galerie-01-20.jpg", alt: "Image 20" },
      { url: "galerie-01-21.jpg", alt: "Image 21" },
      { url: "galerie-01-22.jpg", alt: "Image 22" },
      { url: "galerie-01-23.jpg", alt: "Image 23" },
      { url: "galerie-01-24.jpg", alt: "Image 24" },
      { url: "galerie-01-25.jpg", alt: "Image 25" },
      { url: "galerie-01-26.jpg", alt: "Image 26" },
      { url: "galerie-01-27.jpg", alt: "Image 27" },
      { url: "galerie-01-28.jpg", alt: "Image 28" },
      { url: "galerie-01-29.jpg", alt: "Image 29" },
      { url: "galerie-01-30.jpg", alt: "Image 30" },
      { url: "galerie-01-31.jpg", alt: "Image 31" },
      { url: "galerie-01-32.jpg", alt: "Image 32" },
      { url: "galerie-01-33.jpg", alt: "Image 33" },
      { url: "galerie-01-34.jpg", alt: "Image 34" },
      { url: "galerie-01-35.jpg", alt: "Image 35" },
      { url: "galerie-01-36.jpg", alt: "Image 36" },
      { url: "galerie-01-37a.jpg", alt: "Image 37" },
      { url: "galerie-01-38.jpg", alt: "Image 38" },
      { url: "galerie-01-39.jpg", alt: "Image 39" },
      { url: "galerie-01-40.jpg", alt: "Image 40" },
      { url: "galerie-01-41.jpg", alt: "Image 41" },
      { url: "galerie-01-42.jpg", alt: "Image 42" },
      { url: "galerie-01-43.jpg", alt: "Image 43" },
      { url: "galerie-01-44.jpg", alt: "Image 44" },
      { url: "galerie-01-45.jpg", alt: "Image 45" },
      { url: "galerie-01-46.jpg", alt: "Image 46" },
      { url: "galerie-01-47.jpg", alt: "Image 47" },
      { url: "galerie-01-48.jpg", alt: "Image 48" },
      { url: "galerie-01-49.jpg", alt: "Image 49" },
      { url: "galerie-01-50.jpg", alt: "Image 50" },
      { url: "galerie-01-51.jpg", alt: "Image 51" },
      { url: "galerie-01-52.jpg", alt: "Image 52" },
      { url: "galerie-01-53.jpg", alt: "Image 53" },
      { url: "galerie-01-54.jpg", alt: "Image 54" },
      // { url: "galerie-01-55.jpg", alt: "Image 55" },
      { url: "galerie-01-56.jpg", alt: "Image 56" },
      { url: "galerie-01-57.jpg", alt: "Image 57" },
      { url: "galerie-01-58.jpg", alt: "Image 58" },
      { url: "galerie-01-59.jpg", alt: "Image 59" },
      { url: "galerie-01-60.jpg", alt: "Image 60" },
      { url: "galerie-01-61.jpg", alt: "Image 61" },
      { url: "galerie-01-62.jpg", alt: "Image 62" },
      { url: "galerie-01-63.jpg", alt: "Image 63" },
      { url: "galerie-01-64.jpg", alt: "Image 64" },
      { url: "galerie-01-65.jpg", alt: "Image 65" },
      { url: "galerie-01-66.jpg", alt: "Image 66" }
  ],
    sections: [
      {
        title: "",
        body: (
          <>
          </>
        ),
      },
      {
        title: ":",
        body: (
          <ul className="list-disc pl-4">
            <li></li>
            <li></li>
            <li></li>
          </ul>
        ),
      },
    ],
    cards: [],
  },
 catalogue: {
    title: "Catalogue complet de Marcel Séjour",
    description: "Toutes les oeuvres, dessins et esquisses de Marcel SEJOUR, à Mayotte, Comores, en Anjour et ailleurs....",
    photos: [
      { url: "", alt: "" },
      
    ],
    sections: [
      {
        title: "Catalogue complet de Marcel Séjour",
        body: (
          <ul className="list-disc text-gold-400 pl-4">
            <li> </li>
            <li>  </li>
            <li>  </li>
          </ul>
        ),
      },
    ],
    cards: [
      
      
    ]
  },

};
