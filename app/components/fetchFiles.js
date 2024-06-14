import myFetch from "./myFetch";


async function fetchFiles () {

    const response = await myFetch("/api/upload/files", 'GET', null, 'files');


        const strapiFiles = response;
     
        const files = strapiFiles;
       

    return files

}

export default fetchFiles;


