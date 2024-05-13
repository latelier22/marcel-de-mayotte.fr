import myFetch from "../components/myFech";


async function fetchCitations () {

    const response = await myFetch("/api/citations", 'GET', null, 'citations');


        const strapiCitations = response.data
        console.log(strapiCitations);

        const citations = strapiCitations.map(citation => ({
            id: citation.id,
            ...citation.attributes
        }));
        
        console.log(citations);

    return citations

}

export default fetchCitations;


