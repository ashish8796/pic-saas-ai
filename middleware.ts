import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

// export default clerkMiddleware(
//   (auth, req) => {
//     // console.log("Auth: ", auth());
//     if (req.url.includes("/sign-up") && auth().userId) {
//       // console.log("Sign-up Route");
//       // console.log("req.url: ", req.url);

//       if (window !== undefined) {
//         window.location.href = "/";
//       }

//       return;
//     }

//     if (!isPublicRoute(req)) {
//       const { userId } = auth();

//       if (!userId) {
//         return auth().redirectToSignIn({ returnBackUrl: req.url });
//       }
//       auth().protect();
//     }
//   },
//   { debug: true }
// );

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
