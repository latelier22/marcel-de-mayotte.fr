import {site} from "../site"

export default function getBaseUrl(url) {

    console.log(url)
    const baseUrl = url.startsWith('/uploads')
    ? process.env.NEXT_PUBLIC_STRAPI_URL
    : `${site.vpsServer}/images/`;
    console.log(url,baseUrl)
   

    return baseUrl;
}