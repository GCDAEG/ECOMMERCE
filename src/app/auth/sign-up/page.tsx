import SignUp from "@/components/ui/Log/sign-up";
import { WholeWord } from "lucide-react";
import React from "react";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <div className="p-2 border border-black shadow-md rounded-md">
        <SignUp />
        <div className="w-full h-12">
          <WholeWord className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Page;
