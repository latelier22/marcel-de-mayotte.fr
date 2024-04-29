import Image from "next/image";
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
} from "yet-another-react-lightbox";

function isNextJsImage(slide) {
  return (
    isImageSlide(slide) &&
    typeof slide.width === "number" &&
    typeof slide.height === "number"
  );
}

export default function NextJsImage({ slide, offset, rect , edit=false}) {
  const {
    on: { click },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, "contain");

  if (!isNextJsImage(slide)) return undefined;

  const hasBlackAndWhiteTag = slide.tags?.includes("NOIR ET BLANC");
  
  // Définir le style de la bordure
  const borderStyle = hasBlackAndWhiteTag ? "10px solid white" : "none";

  return (
    <>
    <div style={{ position: "relative", border: borderStyle }}>
      { edit ? <div className="text-white">Salut</div> : ""}
      <Image
        alt=""
        src={slide}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? "blur" : undefined}
        style={{
          objectFit: cover ? "contain" : "none", // Si l'image est une image de couverture, utilisez "contain" pour s'assurer qu'elle s'adapte à la boîte sans déformation
          cursor: click ? "pointer" : undefined,
          width: "auto", // Définir la largeur de l'image sur automatique pour qu'elle s'adapte à sa taille naturelle
          height: "auto", // Définir la hauteur de l'image sur automatique pour qu'elle s'adapte à sa taille naturelle
        }}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
    </>
  );
}
