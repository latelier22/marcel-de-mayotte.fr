"use client"

import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { menuItems, site } from "./site";
import Link from "next/link";

import AdminDropDown from "./admin/AdminDropDown"

import VisibilityToggleButton from "./components/album/icons/VisibilityToggleButton"
import ShowAdminToggleButton from "./components/album/icons/ShowAdminToggleButton"
// import ShowAdminToggleButton from "./components/album/icons/AdminNavBarToggleButton"

import Dropdown from "./Dropdown";

const adminItems = [

  {
    label: "ADMIN",
    children: [

      { label: "Ajouts de photos", route: "/admin/upload" },
      { label: "Voir les import catalogue", route: "/catalogue/import" },
      { label: "Citations", route: "/admin/citations" },
      { label: "Blog", route: "/admin/blog" },



    ],
  },
];






import { useSelector, useDispatch } from 'react-redux';

const Navbar = () => {
  const { data: session } = useSession();  // Récupérer les données de session

  const isAdmin = (session && session.user.role === 'admin')

  const isVisible = useSelector(state => state.visible.isVisible);

  const isShowAdmin = useSelector((state) => state.showAdmin.isShowAdmin);

  // isShowAdmin
  const router = useRouter();

  // console.log(session, "isVisible=", isVisible, "isAdmin", isAdmin)

  useEffect(() => {
    const init = async () => {
      const { Collapse, initTE, Dropdown } = await import("tw-elements");
      initTE({ Collapse, Dropdown });
    };
    init();
  }, []);


  return (
    <>
      <nav
        className="z-40 md:fixed flex w-full items-center justify-between bg-neutral-200 py-2 text-white shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-black dark:text-gold-500 md:flex-wrap"
        data-te-navbar-ref
      >
        <div className="flex w-full  items-center  px-3">
          <a href="/" className="md:hidden ml-2">
            <img src={site.logo.url} className="h-24 w-auto logo" alt="Accueil" />
          </a>
          <div className="flex items-center">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="h-14 w-14"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </span>
            </button>
          </div>

          <div
            className="hidden grow basis-[100%] items-center lg:!flex lg:basis-auto mx-auto"
            id="navbarSupportedContentY"
            data-te-collapse-item
          >
            <ul
              className="mx-auto flex flex-col lg:flex-row"
              data-te-navbar-nav-ref
            >
              {menuItems.map((menuItem, index) => (
                <li
                  key={index}
                  className={`${index > 0 ? "mb-2 " : ""}lg:mb-0 lg:pr-2`}
                  data-te-nav-item-ref
                >
                  <a
                    className={`font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`}
                    href={menuItem.route}
                    data-te-nav-link-ref
                    data-te-ripple-init
                    data-te-ripple-color="light"
                  >
                    {menuItem.label}
                  </a>
                </li>
              ))}

              {/* Ajouter l'option de connexion/déconnexion */}
              {session ? (
                <>
                  <li className="lg:mb-0 lg:pr-2">
                    <button
                      className={`font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`}
                      onClick={() => {
                        signOut({ callbackUrl: '/accueil' });
                        // router.push('/accueil');

                      }}
                    >
                      {session.user.email.split("@", 1)}   /  déconnexion
                    </button>
                  </li>
                  {isAdmin && (

                    <>
                      {/* <AdminNavBarToggleButton /> */}
                      <VisibilityToggleButton />

                      <ShowAdminToggleButton />
                    </>


                  )}
                  {isAdmin && isShowAdmin && (
                    <>
                      <div className="flex gap-8 items-center text-white">
                        {adminItems.map((item, index) => {  // Adding index as a second parameter
                          return item.hasOwnProperty("children") ? (
                            <Dropdown key={item.id || index} item={item} />  // Use item.id if available, otherwise use index
                          ) : (
                            <Link key={item.id || index} className="hover:text-blue-500" href={item?.route || ""}>
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}

                </>
              ) : (
                <>
                  <li className="lg:mb-0 lg:pr-2">
                    <button
                      className={`font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`}
                      onClick={() => signIn()}
                    >
                      Connexion
                    </button>
                  </li>
                  <li className="lg:mb-0 lg:pr-2">
                    <Link
                      className={`font-lien block transition duration-150 text-black ease-in-out hover:text-gold-800 focus:text-gold-500 disabled:text-black/30 dark:text-gold-200 dark:hover:text-gold-800 dark:focus:text-gold-500 lg:p-2 [&.active]:text-black/90`}
                      href={"/inscription"}
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
    </>
  );
};

export default Navbar;



