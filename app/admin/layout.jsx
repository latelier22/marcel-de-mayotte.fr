import Navbar from "../NavBar";

export default function AdminLayout({
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
