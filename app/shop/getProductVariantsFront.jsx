import getProductByCode from "./getProductByCode"; // ← reste le même

const extractProductCode = (productUri) => {
  // Extrait le code depuis "/api/v2/shop/products/PUZ00"
  return productUri.split("/").pop();
};

const getProductVariantsFront = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL + "/api/v2/shop/product-variants";
  const itemsPerPage = 30;
  let page = 1;
  let allVariants = [];
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await fetch(`${baseUrl}?page=${page}&itemsPerPage=${itemsPerPage}`);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();

      const filtered = data["hydra:member"].filter(
        (variant) => variant.isFront === true || variant.isFront === "true"
      );

      const enriched = await Promise.all(
        filtered.map(async (variant) => {
          const productCode = extractProductCode(variant.product);
          const product = await getProductByCode(productCode);
          return {
            ...variant,
            productCode,
            images: product?.images || [],
          };
        })
      );

      allVariants.push(...enriched);

      const totalItems = data["hydra:totalItems"];
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      page++;
      hasMore = page <= totalPages;

    } catch (error) {
      console.error("Erreur lors de la récupération des variants :", error);
      hasMore = false;
    }
  }

  console.log("Variants enrichis avec images des produits :", allVariants);
  return allVariants;
};

export default getProductVariantsFront;
