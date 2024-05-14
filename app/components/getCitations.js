
import fetchCitations from "./fetchCitations";


async function getCitations(onlyPublished = false) {
    try {
        // Fetch all citations
        
        const allCitations = await fetchCitations();

        const citations = onlyPublished ? allCitations.filter ( c => c.etat === "publiée" ) : allCitations;
        
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
            const group = [{ texte: citation.texte, auteur: citation.auteur, etat : citation.etat, parentCitationId : citation.parentCitationId }];
            citation.subCitations.forEach(child => {
                group.push(...flattenCitations(child));
            });
            return group;
        }

        // Format the final results by flattening each top-level citation group
        const formattedResult = topLevelCitations.map(flattenCitations);

        console.log(formattedResult);

        return formattedResult;
    } catch (error) {
        console.error("An error occurred while fetching citations:", error);
        return {
            error: `An error occurred while fetching citations: ${error.toString()}`
        };
    }
}

export default getCitations;
