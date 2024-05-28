import { create } from 'zustand';
import myFetch from '../components/myFetch'; // Assurez-vous que le chemin est correct

const useMenuStore = create((set) => ({
  menuItems: [],
  setMenus: (menus) => {
    console.log('Setting menus:', menus); // Log to see the updated state
    set({ menuItems: menus });
  },
  fetchAndSetMenus: async () => {
    const endpoint = `/api/menus?populate=*`;
    const response = await myFetch(endpoint, 'GET', null, 'menus');

    let { data: menuItems } = response;

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
    const rootMenuItems = menuItems.filter(item => !item.parent);

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

    set({ menuItems: rootMenuItems });
  },
  updateMenuItems: async (menus) => {
    try {
      for (const menu of menus) {
        await myFetch(`/api/menus/${menu.id}`, 'PUT', { data: menu });
        if (menu.children && menu.children.length > 0) {
          for (const child of menu.children) {
            await myFetch(`/api/menus/${child.id}`, 'PUT', { data: child });
          }
        }
      }
      console.log('Menus updated successfully');
    } catch (error) {
      console.error('Error updating menus:', error);
    }
  },
}));

export default useMenuStore;
