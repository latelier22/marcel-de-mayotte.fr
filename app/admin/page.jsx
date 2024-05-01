


import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";
import Gallery from "../components/album/Gallery"
import photos from "../../public/photos.json";

import ImageEditor from "./ImageEditor"
import ImageUpload from "./upload/page"




const Contact = () => {
    const pageTitle = 'Contact';
    const pageDescription = 'Restons en contact, telephone, email, réseaux sociaux';
    return (
        <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
            <Navbar />
            {/* <Gallery photos={[]}/> */}
            <section className="contaiiner h-full pt-32">
                <div className="flex flex-col justify-center items-center">
                    
                    <h1 className="text-center font-bold text-3xl text-bold text-white"> ADMINSATRATION</h1>

                </div>

                <div className="flex flex-col justify-between items-center">
                    
                
                    
               
             

                </div>
            </section>

            <Footer />
        </RootLayout>
    );
};

export default Contact;
