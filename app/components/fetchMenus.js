import myFetch from './myFetch';

async function fetchMenus(id = null) {
  const endpoint = id ? `/api/menus/${id}?populate=*` : `/api/menus?populate=*`;
  const response = await myFetch(endpoint, 'GET', null, 'menus');

  let { data: menuItems } = response;

  console.log(response);

  // Fonction récursive pour transformer les données
  const transformMenuItem = (item) => {
    return {
      id: item.id,
      label: item.attributes?.label,
      route: item.attributes?.route,
      order: item.attributes?.order,
      children: item.attributes?.children?.data.map(transformMenuItem) || [],
      parent: item.attributes?.parent?.data?.id || null
    };
  };

  // Appliquer la transformation aux données du menu
  menuItems = menuItems.map(transformMenuItem);

  // Filtrer les éléments de menu pour ne garder que ceux sans parent
  const rootMenuItems = menuItems.filter(item => !item.attributes?.parent?.data);

  

  // Trier les éléments de menu par le champ "order"
  rootMenuItems.sort((a, b) => a.order - b.order);

  // Trier les sous-menus par le champ "order" également
  const sortChildren = (items) => {
    items.forEach(item => {
      if (item.children) {
        item.children.sort((a, b) => a.order - b.order);
        sortChildren(item.children);
      }
    });
  };

  sortChildren(rootMenuItems);

  console.log('Sorted data:', JSON.stringify(rootMenuItems, null, 2));

  return rootMenuItems.filter( (item) => !item.parent); // Ajout du return
}

export default fetchMenus;
