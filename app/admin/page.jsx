import Navbar from "../NavBar";
import AdminNavBar from "./AdminNavBar"
import Footer from "../Footer";
import RootLayout from "../layout";

import { Pages, site } from "../site";

import getImages from "../components/getImages";

import {authOptions} from "../Auth"
import { getServerSession } from 'next-auth';
import { Adamina } from "next/font/google";

async function Page() {

  const session = await getServerSession(authOptions);

  if (session) {
    // La session existe, vous pouvez accéder à `session.user`, `session.expires`, etc.
    console.log("connecté", session);
   
    
} else {
  
  console.log("non connecté");
}
  
const userId = session?.user?.id || null;
const isAdmin= session.user.role == 'admin';

  // const page = Pages["admin"];
  // const pageTitle = page.title;
  // const pageDescription = page.description;


  return (
    <>

    <Navbar />
    <AdminNavBar />
    
    </>
  );
};

export default Page;
