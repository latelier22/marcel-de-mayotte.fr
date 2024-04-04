import ImagesBar from "./ImagesBar";

const myComponent = () => {
  
    const pictos = [
        {
          url: "menu-picto-7j7.png",
          alt: "Intervention 7j/7",
          text: "Intervention 7j/7",
        },
        {
          url: "menu-picto-devis-gratuit.png",
          alt: "Devis gratuit",
          text: "Devis gratuit",
        },
        {
          url: "menu-picto-intervention-rapide.png",
          alt: "Intervention rapide",
          text: "Intervention rapide",
        },
        {
          url: "menu-picto-urgence.png",
          alt: "24h/24 en cas d'urgence",
          text: "24h/24 en cas d'urgence",
        },
      ];



    return (
     
        <ImagesBar photos={pictos} />
  
    );
  };
  
  export default myComponent;
  