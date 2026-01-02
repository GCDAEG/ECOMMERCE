"use client";

import { useState } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Input } from "../../ui/input";
import { useStore } from "@/lib/stores/useStore";

import HeaderMenu from "./HeaderMenu";
import Categories from "./Categories";
import { Home, ShoppingCart, WholeWord } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
const supabase = createClient();

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const user = useStore((s) => s.user);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    useStore.getState().clearUser();
    useStore.getState().clearCart();

    setOpen(false);
  };

  return (
    <div className="flex col-span-1 row-span-1 md:hidden">
      <div className="w-16 h-full flex justify-center items-center">
        <WholeWord className="size-8" />
      </div>
      <div className="flex-1 h-full px-2 relative ">
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
      <div className="w-12 h-full ">
        {/* Menú Mobile */}
        <div>
          {/* Botón hamburguesa */}
          <button
            className="md:hidden p-2"
            onClick={() => {
              setOpen(true);
              console.log("abrienedo...");
            }}
            aria-label="Open menu"
          >
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Fondo oscuro */}
          <div
            onClick={() => setOpen(false)}
            className={cn(
              "fixed inset-0 w-full bg-black/40 transition-opacity md:hidden z-40",
              open
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            )}
          />

          {/* Panel del menú */}
          <AnimatePresence initial={open}>
            {open && (
              <motion.nav
                initial={{
                  x: "-100%",
                }}
                animate={{
                  x: "0%",
                }}
                exit={{
                  x: "-100%",
                }}
                className={cn(
                  "fixed top-0 left-0 h-full  bg-white shadow-xl z-50 p-5 transition-transform duration-75 md:hidden"
                )}
              >
                <HeaderMenu
                  setOpen={setOpen}
                  user={user}
                  handleLogout={handleLogout}
                />
                {/* Menú principal */}
                <ul className="flex flex-col text-lg w-full">
                  <li className="flex w-full py-2 ">
                    <Link
                      className="flex items-center space-x-2"
                      href="/"
                      onClick={() => setOpen(false)}
                    >
                      <Home className="size-5" />
                      <span>Inicio</span>
                    </Link>
                  </li>

                  <li className="w-full py-2">
                    <Link
                      className="flex items-center space-x-2"
                      href="/cart"
                      onClick={() => setOpen(false)}
                    >
                      <ShoppingCart className="size-5" />
                      <span>Carrito</span>
                    </Link>
                  </li>
                  <Categories />
                  {/* Opciones extra si el usuario está logueado */}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
