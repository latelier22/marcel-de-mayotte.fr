export default async function getTaxons() {
  const baseUrl = process.env.NEXT_PUBLIC_SHOP_URL;

  // 1. Récupération des taxons principaux
  const res = await fetch(`${baseUrl}/api/v2/shop/taxons`, {
    headers: { Accept: 'application/ld+json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error("Erreur lors du fetch des taxons");
  }

  const data = await res.json();
  const taxons = data['hydra:member'];

  // 2. Pour chaque taxon, on récupère ses enfants s’il en a
  const taxonsWithChildren = await Promise.all(
    taxons.map(async (taxon) => {
      const children = await Promise.all(
        taxon.children.map(async (childUri) => {
          const childRes = await fetch(`${baseUrl}${childUri}`, {
            headers: { Accept: 'application/ld+json' },
            cache: 'no-store',
          });

          if (!childRes.ok) {
            console.warn(`Erreur lors du fetch de ${childUri}`);
            return null;
          }

          const child = await childRes.json();
          return {
            id: child.id,
            name: child.name,
            slug: child.slug,
            code: child.code,
          };
        })
      );

      return {
        id: taxon.id,
        name: taxon.name,
        slug: taxon.slug,
        code: taxon.code,
        children: children.filter(Boolean), // on supprime les nulls au cas où
      };
    })
  );

  return taxonsWithChildren;
}
