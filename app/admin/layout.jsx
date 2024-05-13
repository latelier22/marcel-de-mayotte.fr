"use client"


import Navbar from "../NavBar";

import AdminNavBar from "./AdminNavBar"

export default async function AdminLayout({
  children
}) 
{
  return (
    <>
     <Navbar />
    
    {children}
    </>

  );
};
