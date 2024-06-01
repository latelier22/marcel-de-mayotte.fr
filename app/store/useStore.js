import { create } from 'zustand';
import myFetch from '../components/myFetch'; // Assurez-vous que le chemin est correct

const useMenuStore = create((set) => ({
  menuItems: [],
  
  // Setter pour mettre à jour les menus
  setMenus: (menus) => {
    // console.log('Setting menus:', menus); // Log pour voir l'état mis à jour
    set({ menuItems: menus });
  },
  
  // Récupérer et définir les menus depuis l'API
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
    console.log("rootMenuItems",)

    set({ menuItems: rootMenuItems });
  },

  // Ajouter un élément de menu
  addMenuItem: async (newItem) => {
    const payload = {
      data: {
        label: newItem.label,
        route: newItem.route,
        order: newItem.order,
        parent: newItem.parent ? { id: newItem.parent } : null,
      },
    };

    try {
      const response = await myFetch('/api/menus', 'POST', payload, 'menu');
      if (response && response.data) {
        // Re-fetch the updated menus after adding a new item
        await useMenuStore.getState().fetchAndSetMenus();
      }
    } catch (error) {
      console.error('Failed to add new menu item:', error);
    }
  },

  // Mettre à jour un élément de menu
  updateMenuItem: async (updatedItem) => {
    const payload = {
      data: {
        label: updatedItem.label,
        route: updatedItem.route,
        order: updatedItem.order,
        children : updatedItem.children,
        parent: updatedItem.parent ? { id: updatedItem.parent } : null,
      },
    };

    try {
      await myFetch(`/api/menus/${updatedItem.id}`, 'PUT', payload);
      console.log('Menu item updated successfully');
      // Re-fetch the updated menus after updating an item
      await useMenuStore.getState().fetchAndSetMenus();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  },

  // Mettre à jour plusieurs éléments de menu
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
      // Re-fetch the updated menus after updating items
      await useMenuStore.getState().fetchAndSetMenus();
    } catch (error) {
      console.error('Error updating menus:', error);
    }
  },

  // Supprimer un élément de menu
  deleteMenuItem: async (id) => {
    try {
      await myFetch(`/api/menus/${id}`, 'DELETE');
      console.log('Menu item deleted successfully');
      // Re-fetch the updated menus after deleting an item
      await useMenuStore.getState().fetchAndSetMenus();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  },
}));

export default useMenuStore;
