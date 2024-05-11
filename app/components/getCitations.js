import myFetch from "../components/myFech";


async function getCitations() {
    try {
        // Fetch all citations
        const citations = await myFetch("/api/citations/getCitations", 'GET', null, 'citations');
        
        // Create a dictionary to hold all citations with children
        const citationDict = {};
        const topLevelCitations = [];

        // Organize citations by citationId and map children to their parents
        citations.forEach(citation => {
            citationDict[citation.id] = {
                ...citation,
                subCitations: []
            };
        });

        // Link children to their parents
        citations.forEach(citation => {
            if (citation.parentCitationId && citationDict[citation.parentCitationId]) {
                citationDict[citation.parentCitationId].subCitations.push(citationDict[citation.id]);
            } else {
                topLevelCitations.push(citationDict[citation.id]);
            }
        });

        // Function to flatten the hierarchy into groups of related citations
        function flattenCitations(citation) {
            const group = [{ texte: citation.texte, auteur: citation.auteur }];
            citation.subCitations.forEach(child => {
                group.push(...flattenCitations(child));
            });
            return group;
        }

        // Format the final results by flattening each top-level citation group
        const formattedResult = topLevelCitations.map(flattenCitations);

        console.log(formattedResult.slice(0, 2));

        return formattedResult.slice(0, 2);
    } catch (error) {
        console.error("An error occurred while fetching citations:", error);
        return {
            error: `An error occurred while fetching citations: ${error.toString()}`
        };
    }
}

export default getCitations;
