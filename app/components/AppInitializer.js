// app/components/AppInitializer.jsx
'use client'

import { useEffect } from 'react';
import useMenuStore from '../store/useStore';

const AppInitializer = ({ menuItems, children }) => {
  const setMenus = useMenuStore((state) => state.setMenus);

  useEffect(() => {
    setMenus(menuItems);
  }, [menuItems, setMenus]);

  return children;
}

export default AppInitializer;


// 'use client'

// import { useStore } from '../store/useStore'

// export default function AppInitializer({ user, children }) {
//   useStore.setState({ 
//     user,
//     // ...
//   })

//   // ...
//   return children
// }