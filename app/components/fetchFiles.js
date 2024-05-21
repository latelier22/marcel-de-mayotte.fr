import myFetch from "./myFetch";


async function fetchFiles () {

    const response = await myFetch("/api/upload/files", 'GET', null, 'files');


        const strapiFiles = response;
        // console.log("FROM FETCHFILES strapifiles", strapiFiles);

        // const files = strapiFiles.map(f => ({
        //     id: f.id,
        //     ...f.attributes
        // }));

        const files = strapiFiles;
        
        console.log(files)

    return files

}

export default fetchFiles;


