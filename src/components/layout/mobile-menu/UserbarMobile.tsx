import { Button } from "@/components/ui/button";
import { User } from "@/lib/stores/authSlice";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";

interface UserbarMobileProps {
  user: User | null;
  handleLogout: () => void;
  setOpen: (e: boolean) => void;
}

const UserbarMobile: React.FC<UserbarMobileProps> = ({
  user,
  handleLogout,
  setOpen,
}) => {
  const [expand, setExpand] = useState(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };
  return (
    <div className="w-full ">
      {/* Si hay usuario → avatar */}
      {user ? (
        <div className="flex flex-col w-full h-fit items-center justify-center gap-3 mb-6 relative transition-all duration-200 overflow-hidden">
          <div
            className="w-full space-x-2 flex items-start "
            onClick={toggleExpand}
          >
            <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-normal font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium truncate overflow-hidden text-xs">
                {user.email}
              </p>
            </div>
            <button className="w-7" onClick={toggleExpand}>
              <ChevronDown className={`${expand && "rotate-180"}`} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expand && (
              <motion.div
                key="dropdownuser"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden flex flex-col w-full items-start"
              >
                <ul className="flex flex-col w-full">
                  <li className="p-2" onClick={() => setOpen(false)}>
                    <Link href={"/profile/orders"}>Ordenes</Link>
                  </li>

                  <li onClick={handleLogout} className="p-2 ">
                    Cerrar sesión
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Si NO hay usuario → botones de login */
        <div className="flex flex-col gap-2 mb-6">
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="text-blue-600 font-medium"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/auth/sign-up"
            onClick={() => setOpen(false)}
            className="text-blue-600 font-medium"
          >
            Registrarse
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserbarMobile;
