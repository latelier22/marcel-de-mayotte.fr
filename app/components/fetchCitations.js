import myFetch from "../components/myFetch";


async function fetchCitations () {

    const response = await myFetch("/api/citations", 'GET', null, 'citations');


        const strapiCitations = response.data
        

        const citations = strapiCitations.map(citation => ({
            id: citation.id,
            ...citation.attributes
        }));
        
       

    return citations

}

export default fetchCitations;


