"use client"

import Navbar from "../../NavBar";
import Footer from "../../Footer";
import RootLayout from "../../layout";





const Contact = () => {
    const pageTitle = 'Contact';
    const pageDescription = 'Restons en contact, telephone, email, réseaux sociaux';
    return (
        <RootLayout pageTitle ={pageTitle} pageDescription={pageDescription}>
            <Navbar />
            {/* <Gallery photos={[]}/> */}
            <section className="contaiiner h-full pt-32">
                <div className="flex flex-col justify-center items-center">
                    
                    <h1 className="text-center font-bold text-3xl text-bold text-white"> ADMINSATRATION</h1>

                </div>

                <div className="flex flex-col justify-between items-center">
                    
                <form action="/api/upload" method="post" encType="multipart/form-data">
        <input type="file" name="file" required />
        <button className="ring-2 px-3 py-2 bg-blue-800 text-white rounded-md">
          upload
        </button>
      </form>
                    
               
             

                </div>
            </section>

            <Footer />
        </RootLayout>
    );
};

export default Contact;
