"use client"

import MyVideo from "../../../MyVideo"

const Page = ({ params }) => {
  const videoId = params.pageSlug;
  const pageTitle = 'Videos';
  const pageDescription = 'Restons en contact, telephone, email, réseaux sociaux';
  return (
    
      <div className="container flex flex-row mx-auto py-2 md:py-8 md:px-12 lg:px-20 lg:py-12 animate-appear">
      <MyVideo videoId ={videoId}/>
      </div>
      
  );
};

export default Page;
