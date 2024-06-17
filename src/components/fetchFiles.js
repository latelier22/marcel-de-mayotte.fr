// fetchFiles.js
import myFetch from "./myFetch";

async function fetchFiles(fileType = 'all') {
    const response = await myFetch("/api/upload/files", 'GET', null, 'json');
    const strapiFiles = response;

    let files;
    if (fileType === 'image') {
        files = strapiFiles.filter(file => file.mime.startsWith('image/'));
    } else if (fileType === 'video') {
        files = strapiFiles.filter(file => file.mime.startsWith('video/'));
    } else {
        files = strapiFiles; // No filter for 'all', return everything
    }

    return files;
}

export default fetchFiles;

export function transformResponse(response) {
    return response.map(file => ({
        src: `http://vps.latelier22.fr:1336${file.url}`,
        width: file.width,
        height: file.height,
        id: file.id
    }));
}