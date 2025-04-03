const getProductByCode = async (code) => {
    const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL;
    const url = `${baseUrl}/api/v2/shop/products/${code}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();
  
      const images = (data.images || []).map((img) => {
        let fullUrl = img.path;
  
        // Correction automatique du path
        if (fullUrl && !fullUrl.startsWith("http")) {
          fullUrl = `${baseUrl}${fullUrl}`;
        }
  
        // Log de chaque image complète
        console.log(`[${code}] Image URL:`, fullUrl);
  
        return {
          ...img,
          url: fullUrl,
        };
      });
  
      return { ...data, images };
  
    } catch (error) {
      console.error(`❌ Erreur produit ${code} :`, error);
      return null;
    }
  };
  
export default getProductByCode;
  
