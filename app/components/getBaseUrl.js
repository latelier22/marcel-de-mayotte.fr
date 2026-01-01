import {site} from "../site"

export default function getBaseUrl(url) {

    const baseUrl = url.startsWith('/uploads') || url.startsWith('/converted')
    ? process.env.NEXT_PUBLIC_STRAPI_URL
    : `${site.vpsServer}/images/`;
    
    return baseUrl;
}