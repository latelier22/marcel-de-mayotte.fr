
import fetchFiles from "./fetchFiles";


async function getFiles(onlyPublished = false) {
    try {
        // Fetch all citations
        
        const allFiles = await fetchFiles();

        const files = allFiles;
        
        return files;
    } catch (error) {
        console.error("An error occurred while fetching files:", error);
        return {
            error: `An error occurred while fetching files: ${error.toString()}`
        };
    }
}

export default getFiles;
