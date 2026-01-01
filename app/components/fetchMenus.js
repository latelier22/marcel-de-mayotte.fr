import myFetch from './myFetch';

async function fetchMenus(id = null) {
  const endpoint = id ? `/api/menus/${id}?populate=*` : `/api/menus?populate=*`;
  const response = await myFetch(endpoint, 'GET', null, 'menus');

  let { data: menuItems } = response;

  // Create a map of items by their ID
  const itemMap = {};
  menuItems.forEach((item) => {
    itemMap[item.id] = {
      id: item.id,
      label: item.attributes?.label,
      route: item.attributes?.route,
      order: item.attributes?.order,
      children: [],
      parent: item.attributes?.parent?.data?.id || null
    };
  });

  // Build the tree structure
  menuItems.forEach((item) => {
    const parentId = item.attributes?.parent?.data?.id;
    if (parentId) {
      if (!itemMap[parentId].children) {
        itemMap[parentId].children = [];
      }
      itemMap[parentId].children.push(itemMap[item.id]);
    }
  });

  // Filter and sort root items
  const rootMenuItems = menuItems.filter(item => !item.attributes?.parent?.data).map(item => itemMap[item.id]);
  rootMenuItems.sort((a, b) => a.order - b.order);

  // Sort children by order
  const sortChildren = (items) => {
    items.forEach(item => {
      if (item.children.length > 0) {
        item.children.sort((a, b) => a.order - b.order);
        sortChildren(item.children);
      }
    });
  };

  sortChildren(rootMenuItems);


  return rootMenuItems;
}

export default fetchMenus;
