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

    // Fonction récursive pour transformer les données et ajouter les parents
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

    // Créer une map des éléments de menu par ID pour faciliter l'assignation des enfants aux parents
    const menuMap = {};
    menuItems.forEach(item => {
      menuMap[item.id] = item;
    });

    // Filtrer les éléments de menu pour ne garder que ceux sans parent
    const rootMenuItems = menuItems.filter(item => !item.parent);

    // Trier les éléments de menu par le champ "order"
    const sortChildren = (items) => {
      items.forEach(item => {
        if (item.children) {
          item.children.sort((a, b) => a.order - b.order);
          sortChildren(item.children);
        }
      });
    };

    rootMenuItems.sort((a, b) => a.order - b.order);
    sortChildren(rootMenuItems);

    set({ menuItems: rootMenuItems });
  },
  updateMenuItems: async (menus) => {
    try {
      const updateMenu = async (menu) => {
        const payload = {
          data: {
            label: menu.label,
            route: menu.route,
            order: menu.order,
            parent: menu.parent ? { id: menu.parent } : null,
          },
        };
        await myFetch(`/api/menus/${menu.id}`, 'PUT', payload);
        if (menu.children && menu.children.length > 0) {
          for (const child of menu.children) {
            await updateMenu(child);
          }
        }
      };

      for (const menu of menus) {
        await updateMenu(menu);
      }

      console.log('Menus updated successfully');
    } catch (error) {
      console.error('Error updating menus:', error);
    }
  },
}));

export default useMenuStore;
