import NavbarClient from "./NavBarClient";
import fetchMenus from "components/fetchMenus";

async function NavBar() {

  // const menuItems = await fetchMenus()

  return (
    <div>
      {/* <NavbarClient menuItems={menuItems} /> */}
      <NavbarClient  />
    </div>
  );
}

export default NavBar;
