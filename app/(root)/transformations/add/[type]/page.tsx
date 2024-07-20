import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  console.log("UserId: ", userId);

  if (!userId) return redirect("/sign-in");
  const user = await getUserById(userId);

  console.log("User: ", user);

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      {user && (
        <TransformationForm
          action="Add"
          userId={user?._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      )}
    </>
  );
};

export default AddTransformationTypePage;
