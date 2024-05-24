import myFetch from './myFetch';

async function fetchMenus(id = null) {
  const endpoint = id ? `/api/menus/${id}?populate=*` : `/api/menus?populate=children.children`;
  const response = await myFetch(endpoint, 'GET', null, 'menus');

  let { data: menuItems } = response;

  console.log(response)


  // Restructurer les données pour obtenir un format plus simple
  menuItems = menuItems.map(item => {
   

    const transformedItem = {
      id: item.id,
      label: item.attributes?.label,
      route: item.attributes?.route,
      order: item.attributes?.order,
      children: item.attributes?.children ? item.attributes.children.map(child => {
        

        const transformedChild = {
          id: child.id,
          label: child.label,
          route: child.route,
          order: child.order,
          children: child.children ? child.children.map(subChild => {
            

            const transformedSubChild = {
              id: subChild.id,
              label: subChild.label,
              route: subChild.route,
              order: subChild.order,
            };

            // console.log('Transformed subChild:', JSON.stringify(transformedSubChild, null, 2));
            return transformedSubChild;
          }) : []
        };

        // console.log('Transformed child:', JSON.stringify(transformedChild, null, 2));
        return transformedChild;
      }) : []
    };

    // console.log('Transformed item:', JSON.stringify(transformedItem, null, 2));
    return transformedItem;
  });

//   console.log('Transformed data:', JSON.stringify(menuItems, null, 2));

  // Trier les éléments de menu par le champ "order"
  menuItems.sort((a, b) => a.order - b.order);

  // Trier les sous-menus par le champ "order" également
  menuItems.forEach(menuItem => {
    if (menuItem.children) {
      menuItem.children.sort((a, b) => a.order - b.order);
      menuItem.children.forEach(child => {
        if (child.children) {
          child.children.sort((a, b) => a.order - b.order);
        }
      });
    }
  });

console.log('Sorted data:', JSON.stringify(menuItems, null, 2));

  return menuItems; // Ajout du return
}

export default fetchMenus;
