export { default } from 'next-auth/middleware';

export const config = { matcher: ['/admin'] };
// export const config = { matcher: ['/admin/:path*'] };
