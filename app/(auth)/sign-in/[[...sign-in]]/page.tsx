import { SignIn } from "@clerk/nextjs";
import React from "react";

const SingInPage = () => {
  console.log("IM on SingInPage");
  return <SignIn />;
};

export default SingInPage;
