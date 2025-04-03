const getImagesProductById = async (variantId) => {
    const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL;
    const url = `${baseUrl}/api/v2/shop/product-images/${variantId}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();
  
      const imageWithUrl = {
        ...data,
        url: `${baseUrl}${data.path}`
      };
  
      console.log(`Image enrichie du variant ${variantId} :`, imageWithUrl);
      return imageWithUrl;
  
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'image du variant ${variantId} :`, error);
      return null;
    }
  };
  
  export default getImagesProductById;
  