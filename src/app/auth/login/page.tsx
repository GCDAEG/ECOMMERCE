import LoginForm from "@/components/ui/LoginForm";
import { WholeWord } from "lucide-react";
import React from "react";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  return (
    <div className="min-h-screen flex flex-col space-y-5 justify-center items-center px-2">
      <div className="p-2 border border-gray-100 shadow-md rounded-md">
        <LoginForm />
        <div className="w-full h-16">
          <WholeWord className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Page;
