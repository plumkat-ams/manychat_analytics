export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/analytics/:path*",
    "/home",
  ],
};
