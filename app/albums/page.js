

import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import Gallery from "../components/album/Gallery"
import photos from "../../public/photos.json";



const Contact = () => {
  const pageTitle = 'Contact';
  const pageDescription = 'Restons en contact, telephone, email, réseaux sociaux';
  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />
        <Gallery photos={photos}/>
      <Footer />
    </RootLayout>
  );
};

export default Contact;
