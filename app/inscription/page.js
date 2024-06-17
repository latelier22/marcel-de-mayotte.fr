
import { getServerSession } from 'next-auth';
import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout.jsx";
import RegisterForm from "./form";

import { redirect } from 'next/navigation';

async function RegisterPage () {

  const session = await getServerSession();

  const pageTitle = 'Inscription';
  const pageDescription = 'Inscrivez-vous sur le site de Marcel Séjour';

  if (session) {
    redirect('/');
  }
  
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
        <RegisterForm/>
      <Footer />
    </RootLayout>
  );
};

export default RegisterPage;


