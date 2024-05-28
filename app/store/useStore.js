// app/store/useStore.js

import { create } from 'zustand';

const useMenuStore = create((set) => ({
  menuItems: [],
  setMenus: (menus) => {
    console.log('Setting menus:', menus); // Log to see the updated state
    set({ menuItems: menus });
  },
}));

export default useMenuStore;
