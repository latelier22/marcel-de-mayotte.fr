import { create } from 'zustand';
import myFetch from '../components/myFetch'; // Assurez-vous que le chemin est correct

const useMenuStore = create((set) => ({
  menuItems: [],
  setMenus: (menus) => {
    console.log('Setting menus:', menus); // Log to see the updated state
    set({ menuItems: menus });
  },
  updateMenuItems: async (menus) => {
    try {
      const response = await myFetch('/api/menus', 'PUT', { menus }, 'menus');
      if (response.ok) {
        console.log('Menus updated successfully');
      } else {
        console.error('Failed to update menus', response.statusText);
      }
    } catch (error) {
      console.error('Error updating menus:', error);
    }
  },
}));

export default useMenuStore;
