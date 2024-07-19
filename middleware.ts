import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/"]);
const isPublicRoute = createRouteMatcher(["/api/webhooks/clerk"]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return;
  } else if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
