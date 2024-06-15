"use client";

import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { site } from "./site";
import Link from "next/link";
import VisibilityToggleButton from "./components/album/icons/VisibilityToggleButton";
import ShowAdminToggleButton from "./components/album/icons/ShowAdminToggleButton";
import Dropdown from "./DropDown";
import { useSelector } from 'react-redux';
import useMenuStore from 'store/useStore';
import Image from "next/image";
import { Heart, Star } from "./components/album/icons";

const NavbarClient = () => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const { data: session } = useSession();
  const isAdmin = session && session.user.role === 'admin';
  const isVisible = useSelector(state => state.visible.isVisible);
  const isShowAdmin = useSelector(state => state.showAdmin.isShowAdmin);
  const router = useRouter();

  // Séparer l'item ADMIN des autres items de menu
  const regularMenuItems = menuItems.filter(item => item.route !== '/admin');
  const adminMenuItem = menuItems.find(item => (item.route === '/admin') || (item.route === '/catalogue/non-publiees') );

  useEffect(() => {
    const init = async () => {
      const { Collapse, initTE, Dropdown } = await import("tw-elements");
      initTE({ Collapse, Dropdown });
    };
    init();
  }, []);

  const getIconForRoute = (route) => {
    if (route.includes("favoris")) {
      return <Heart isOpen={true} className="mr-2" />;
    }
    if (route.includes("recents")) {
      return <Star isOpen={true} className="mr-2" />;
    }
    return null;
  };

  return (
    <>
      <nav className="z-40 md:fixed flex w-full items-center justify-between bg-neutral-200 py-2 text-white shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-black dark:text-gold-500 md:flex-wrap" data-te-navbar-ref>
        <div className="flex flex-row w-full gap-4 justify-start items-start px-3">
        
          <div className="flex flex-col justify-start items-center">
          <Image src={site.logo.url} alt="Accueil" width={48} height={48} />
            <button
              className="border-0 bg-transparent px-2 text-xl leading-none transition-shadow duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 dark:hover:text-white dark:focus:text-white lg:hidden"
              type="button"
              data-te-collapse-init
              data-te-target="#navbarSupportedContentY"
              aria-controls="navbarSupportedContentY"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="[&>svg]:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-14 w-14">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </span>
            </button>
          </div>
         

          <div className="hidden grow basis-[100%] items-center lg:!flex lg:basis-auto ml-auto" id="navbarSupportedContentY" data-te-collapse-item>
            <ul className="flex flex-col lg:flex-row flex-wrap lg:justify-end" data-te-navbar-nav-ref>
              {regularMenuItems.map((menuItem) => (
                <li key={menuItem.id} className={`lg:mb-0 lg:pl-2`} data-te-nav-item-ref>
                  {menuItem.children && menuItem.children.length ? (
                    <Dropdown className="" item={menuItem} />
                  ) : (
                    <a
                      className={`font-lien flex flex-row transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`}
                      href={menuItem.route}
                      data-te-nav-link-ref
                      data-te-ripple-init
                      data-te-ripple-color="light"
                    >
                      {getIconForRoute(menuItem.route)}
                      {menuItem.label}
                    </a>
                  )}
                </li>
              ))}

              {session ? (
                <>
                  <li className="lg:mb-0 lg:pl-2">
                    <button
                      className={`font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`}
                      onClick={() => {
                        signOut({ callbackUrl: '/accueil' });
                      }}
                    >
                      {session.user.email.split("@", 1)} / déconnexion
                    </button>
                  </li>
                  {isAdmin && (
                    <>
                      <VisibilityToggleButton />
                      <ShowAdminToggleButton />
                    </>
                  )}
                  {isAdmin && isShowAdmin && adminMenuItem && (
                    <div className="flex gap-8 items-center text-white">
                      <Dropdown item={adminMenuItem} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <li className="lg:mb-0 lg:pl-2">
                    <button
                      className={`font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`}
                      onClick={() => signIn()}
                    >
                      Connexion
                    </button>
                  </li>
                  <li className="lg:mb-0 lg:pl-2">
                    <Link className={`font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`} href={"/inscription"}>
                      Inscription
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarClient;
