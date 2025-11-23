import { User } from "@/lib/stores/authSlice";
import React from "react";
import UserbarMobile from "./UserbarMobile";

interface HeaderMenuProps {
  user: User | null;
  setOpen: (e: boolean) => void;
  handleLogout: () => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  user,
  setOpen,
  handleLogout,
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menú</h2>
        <button onClick={() => setOpen(false)} aria-label="Close menu">
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <UserbarMobile
        user={user}
        setOpen={setOpen}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default HeaderMenu;
