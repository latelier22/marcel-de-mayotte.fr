// app/store/useStore.js

import { create } from 'zustand'
const useMenuStore = create((set) => ({
  menuItems: [],
  setMenus: (menus) => set({ menuItems: menus }),
}));

export default useMenuStore;








// app/store/useStore.js

// import { create } from 'zustand'

// export const useStore = create(() => ({
//   menuItems: []
// }))