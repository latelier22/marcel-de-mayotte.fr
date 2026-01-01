// components/Gallery/NextJsImage.jsx
import Image from "next/image";
import Link from "next/link";

export default function NextJsImage({ slide, rect }) {
  // sécurité : on vérifie qu'on a bien une image avec largeur / hauteur
  if (
    !slide ||
    typeof slide !== "object" ||
    typeof slide.src !== "string" ||
    typeof slide.width !== "number" ||
    typeof slide.height !== "number"
  ) {
    return null;
  }

  // --- gestion du ratio pour que ça TIENT dans la fenêtre (contain) ---
  const imageAspectRatio = slide.width / slide.height;
  const rectAspectRatio = rect.width / rect.height;

  let width;
  let height;

  if (imageAspectRatio > rectAspectRatio) {
    // image plus "large" que la zone => on se cale sur la largeur dispo
    width = rect.width;
    height = rect.width / imageAspectRatio;
  } else {
    // image plus "verticale" => on se cale sur la hauteur dispo
    height = rect.height;
    width = rect.height * imageAspectRatio;
  }

  width = Math.round(width);
  height = Math.round(height);

  // --- détection du tag "NOIR ET BLANC" (tags en string OU en objets) ---
  const hasBlackAndWhiteTag =
    Array.isArray(slide.tags) &&
    slide.tags.some((tag) => {
      if (!tag) return false;
      if (typeof tag === "string") return tag === "NOIR ET BLANC";
      if (typeof tag === "object" && tag.name)
        return tag.name === "NOIR ET BLANC";
      return false;
    });

  const borderStyle = hasBlackAndWhiteTag ? "10px solid white" : "none";

  // URL produit (comme avant)
  const productUrl = `https://boutique.marcel-de-mayotte.fr/redirect-to-product/TAB${slide.id}`;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        margin: "0 auto",
        border: borderStyle,
        maxWidth: "100vw",
        maxHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link href={productUrl} target="_blank">
        <Image
          src={slide.src}
          alt={slide.title || slide.name || ""}
          fill
          sizes={`${width}px`}
          draggable={false}
          style={{
            objectFit: "contain", // ✅ on VOIT TOUTE l'image, même en vertical
            maxWidth: "100%",
            maxHeight: "100%",
            cursor: "pointer",
          }}
        />
      </Link>
    </div>
  );
}
