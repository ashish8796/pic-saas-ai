import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type ILogoProps = {
  className?: string;
};

const Logo = ({ className }: ILogoProps) => {
  return (
    <div className={cn("flex flex-center w-fit", className)}>
      <Image
        src="/assets/images/logo-icon.svg"
        alt="logo"
        width={38}
        height={38}
      />
      <p className="text-purple-600 font-bold text-2xl mb-[-6px]">PicSaasAI</p>
    </div>
  );
};

export default Logo;
