import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/"]);
const isPublicRoute = createRouteMatcher([
  "/api/webhooks/clerk",
  "/sign-in",
  "/sign-up",
]);

export default clerkMiddleware(
  (auth, req) => {
    if (isPublicRoute(req)) {
      console.log("Public route: ", req.url);
      return;
    }

    if (!auth().userId && isProtectedRoute(req)) {
      console.log("Protected route: ", req.url);
      auth().protect();
    }
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
