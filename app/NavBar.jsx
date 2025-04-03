import NavbarClient from "./NavBarClient";

async function NavBar( {taxons}) {

  return (
    <div>
      {/* <NavbarClient menuItems={menuItems} /> */}
      <NavbarClient taxons={taxons} />
    </div>
  );
}

export default NavBar;
