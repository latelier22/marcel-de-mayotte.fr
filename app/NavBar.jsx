import NavbarClient from "./NavBarClient";
import getTaxons from "./shop/getTaxons";

async function NavBar( ) {

  const taxons = await getTaxons(); // 👈 fetch server-side depuis /shop

  return (
    <div>
      {/* <NavbarClient menuItems={menuItems} /> */}
      {/* <NavbarClient taxons={taxons} /> */}
      <NavbarClient/>
    </div>
  );
}

export default NavBar;
