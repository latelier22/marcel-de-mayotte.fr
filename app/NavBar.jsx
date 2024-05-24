import NavbarClient from "./NavBarClient"

import myFetch from "components/myFetch";


async function NavBar() {

  const res = await myFetch("/api/menus?populate=*", 'GET', null, 'menus');

  let { data: menuItems } =  res;

  // Restructurer les données pour obtenir un format plus simple
  menuItems = menuItems.map(item => ({
    id: item.id,
    ...item.attributes
  }));

  // Trier les éléments de menu par le champ "order"
  menuItems.sort((a, b) => a.order - b.order);

  // Trier les sous-menus par le champ "order" également
  menuItems.forEach(menuItem => {
    if (menuItem.children) {
      menuItem.children.sort((a, b) => a.order - b.order);
    }
  });

  return (
    <div>
      <NavbarClient menuItems={menuItems} />
    </div>
  );
}




export default NavBar;