export default async function getTaxons() {
    const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL;
  
    const res = await fetch(`${baseUrl}/api/v2/shop/taxons`, {
      headers: {
        'Accept': 'application/ld+json',
      },
      cache: 'no-store',    
    });
  
    if (!res.ok) {
      throw new Error("Erreur lors du fetch des taxons");
    }
  
    const data = await res.json();
    const taxons = data['hydra:member'];
  
    return taxons.map((taxon) => ({
      id: taxon.id,
      name: taxon.name,
      slug: taxon.slug,
    }));
  }
  