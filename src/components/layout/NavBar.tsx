"use client";

import React from "react";
import { Input } from "../ui/input";

import UserBar from "./UserBar";
import { useStore } from "@/lib/stores/useStore";
import { WholeWord } from "lucide-react";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const user = useStore((s) => s.user);

  console.log(user, "sorete");

  return (
    <div className="col-span-1 row-span-2 bg-red-500 hidden md:grid grid-cols-4 grid-rows-2">
      <div className="bg-rose-300 col-span-1 row-span-1">
        <WholeWord />
      </div>
      <div className="col-span-2 h-full px-2 relative ">
        <div className="w-full h-full flex border border-black px-2">
          <Input className="border-none focus:border-transparent"></Input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
      <div className="bg-rose-400 col-span-1 row-span-1 flex justify-end items-center pr-2">
        <UserBar />
      </div>
      <div className="bg-rose-800 col-span-1 row-span-1"></div>
      <div className="bg-rose-900 col-span-1 row-span-1"></div>
      <div className="bg-rose-200 col-span-1 row-span-1"></div>
      <div className="bg-rose-100 col-span-1 row-span-1"></div>
    </div>
  );
};

export default NavBar;
