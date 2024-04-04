

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import FormContact from "../FormContact";

const Contact = () => {
  const pageTitle = 'Contact';
  const pageDescription = 'Restons en contact, telephone, email, réseaux sociaux';
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
      <FormContact/>
      <Footer />
    </RootLayout>
  );
};

export default Contact;
