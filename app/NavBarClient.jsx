'use client';

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
import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';

const shopUrl = process.env.NEXT_PUBLIC_SHOP_URL;

const resolveRoute = (route) => {
  if (route.startsWith("/shop")) {
    return `${shopUrl}/fr_FR${route.slice(5)}`;
  }
  return route;
};

const NavbarClient = () => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const { data: session } = useSession();
  const isAdmin = session && session.user.role === 'admin';
  const isShowAdmin = useSelector(state => state.showAdmin.isShowAdmin);
  const router = useRouter();

  // Séparer l'item ADMIN des autres items de menu
  const regularMenuItems = menuItems.filter(item => item.route !== '/admin');
  const adminMenuItem = menuItems.find(item => (item.route === '/admin') || (item.route === '/catalogue/non-publiees'));

  useEffect(() => {
    const init = async () => {
      const { Collapse, initTE, Dropdown } = await import("tw-elements");
      initTE({ Collapse, Dropdown });
    };
    init();
  }, []);

  return (
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
            {regularMenuItems.map((menuItem) => {
              if (menuItem.label === "FAVORIS" && !session) {
                return null; // Ne pas afficher "FAVORIS" si l'utilisateur n'est pas connecté
              }

              const isBoutique = menuItem.label === 'BOUTIQUE';
              const isFavoris = menuItem.label === 'FAVORIS';
              const isRecents = menuItem.label === 'Tableaux Récents';

              return (
                <li
                  key={menuItem.id}
                  className={`lg:mb-0 lg:pl-2 ${isBoutique ? 'bg-cyan-500' : ''}`}
                  data-te-nav-item-ref
                >
                  {menuItem.children && menuItem.children.length > 0 ? (
                    <div className="relative group">
                      <span className="font-lien flex items-center cursor-pointer transition duration-150 text-black hover:text-gold-800 dark:text-gold-200 dark:hover:text-gold-800 lg:p-2">
                        {isBoutique && <FaShoppingCart className="mr-2" />}
                        {isFavoris && <FaHeart className="mr-2" />}
                        {isRecents && <FaStar className="mr-2" />}
                        {menuItem.label}
                        <svg className="ml-1 w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.25 7.5l4.75 5 4.75-5H5.25z" />
                        </svg>
                      </span>
                      <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white text-black rounded-md shadow-lg z-50 min-w-[220px]">
                        {menuItem.children.map((child) => (
                          <a
                            key={child.id}
                            href={resolveRoute(child.route)}
                            className="block px-4 py-2 whitespace-nowrap hover:bg-gray-100"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      className="font-lien flex flex-row items-center transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90"
                      href={resolveRoute(menuItem.route)}
                      data-te-nav-link-ref
                      data-te-ripple-init
                      data-te-ripple-color="light"
                    >
                      {isBoutique && <FaShoppingCart className="mr-2" />}
                      {isFavoris && <FaHeart className="mr-2" />}
                      {isRecents && <FaStar className="mr-2" />}
                      {menuItem.label}
                    </a>
                  )}
                </li>
              );
            })}

            {session ? (
              <>
                <li className="lg:mb-0 lg:pl-2">
                  <button
                    className="font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90"
                    onClick={() => signOut({ callbackUrl: '/accueil' })}
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
                    className="font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90"
                    onClick={() => signIn()}
                  >
                    Connexion
                  </button>
                </li>
                <li className="lg:mb-0 lg:pl-2">
                  <Link
                    className="font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90"
                    href="/inscription"
                  >
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarClient;
