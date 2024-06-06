import myFetch from "./myFetch";


async function fetchPictures () {

    const response = await myFetch("/api/pictures", 'GET', null, 'pictures');


    const strapiData = response.data;
    const strapiPictures = Array.isArray(strapiData) ? strapiData : [strapiData];

         const pictures = strapiPictures.map(f => ({
             id: f.id,
             ...f.attributes
         }));


    return pictures

}

export default fetchPictures;
