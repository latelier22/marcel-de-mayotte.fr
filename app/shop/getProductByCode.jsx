const getProductByCode = async (code) => {
    const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL;
    const url = `${baseUrl}/api/v2/shop/products/${code}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();
  
      const images = (data.images || []).map((img) => {
        let url = img.path;
  
        // ✅ Cas spécial : path Sylius galerie
        if (url.includes("/gallery/images/")) {
          url = url.replace("/media/image/", "/media/");
        }
  
        // ✅ Préfixe complet si ce n'est pas déjà une URL
        if (!url.startsWith("http")) {
          url = `${baseUrl}${url}`;
        }
  
        console.log(`[${code}] Image URL:`, url);
  
        return { ...img, url };
      });
  
      return { ...data, images };
  
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${code} :`, error);
      return null;
    }
  };
  
export default getProductByCode;
  
