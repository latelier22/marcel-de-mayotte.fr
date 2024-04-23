import Navbar from "../NavBar";
import Footer from "../Footer";
import RootLayout from "../layout";

import { Pages } from "../site";


async function Page() {


  const page = Pages["catalogue"];
  const pageTitle = page.title;
  const pageDescription = page.description;


  return (
    <RootLayout pageTitle={pageTitle} pageDescription={pageDescription}>
      <Navbar />

      <Footer />
    </RootLayout>
  );
};

export default Page;
