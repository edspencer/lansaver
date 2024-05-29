import { auth } from "@/auth";

import { apiAuthPrefix, authRoutes } from "./routes";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthAPI = req.url.startsWith(apiAuthPrefix);

  console.log(req.url);

  console.log("yea");
  console.log(req.nextUrl.pathname);

  if (isAuthAPI) {
    return;
  }

  // if (authRoutes.includes(req.nextUrl.pathname)) {
  //   return;
  // }

  if (!req.auth) {
    // const url = req.url.replace(req.nextUrl.pathname, "/auth/login");
    const regex = new RegExp(`${req.nextUrl.pathname}(?!.*${req.nextUrl.pathname})`);
    const url = req.url.replace(regex, "/api/auth/signin");

    console.log(req.nextUrl.pathname);
    console.log(url);
    console.log("REDIRECTING");
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
