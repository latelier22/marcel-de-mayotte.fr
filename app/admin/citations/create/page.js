

import CitationForm from "./form";

async function createCitation () {

  const pageTitle = 'Creation citation';
  const pageDescription = 'Gestion des citations';
  
  return (
    <main>
      
        <CitationForm/>
      
    </main>
  );
};

export default createCitation;


