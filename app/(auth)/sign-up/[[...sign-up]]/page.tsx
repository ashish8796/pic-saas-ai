import { SignUp } from "@clerk/nextjs";
import React from "react";

const SingUpPage = () => {
  console.log("IM on SingUpPage");
  return (
    <SignUp
      forceRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL
      }
    />
  );
};

export default SingUpPage;
