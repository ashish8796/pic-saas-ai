import { SignIn } from "@clerk/nextjs";
import React from "react";

const SingInPage = () => {
  console.log("IM on SingInPage");
  return (
    <SignIn
      forceRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL
      }
    />
  );
};

export default SingInPage;
