"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Home, ShoppingBag } from "lucide-react";
interface CategoriesProps {}

const supabase = createClient();
const Categories: React.FC<CategoriesProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const loadCategories = async () => {
      const { data: categories, error } = await supabase
        .from("categories")
        .select("*");

      if (error) {
        return setCategories([]);
      }
      console.log(categories);
      setCategories(categories);
    };
    loadCategories();
  }, []);

  return (
    <div
      className="w-full flex justify-start flex-col items-start overflow-hidden"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center w-full select-none cursor-pointer py-2">
        <div className="flex-1 flex items-center space-x-2">
          <ShoppingBag className="size-5" />
          <span>Productos</span>
        </div>
        <ChevronUp className={`size-4 ${!open && "rotate-180"}`} />
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            key="dropdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col"
          >
            {categories.map((cat) => (
              <Link
                href={`/products/${cat.slug}`}
                key={cat.id}
                className="py-2 pl-4 text-sm hover:text-blue-600"
              >
                {cat.name}
              </Link>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {/* <ul
        className={`w-full flex flex-col items-start transition-all duration-500 border-gray-200 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {categories &&
          categories.map((c, i) => (
            <Link
              key={c.id}
              href={`#`}
              className={`pl-5 py-2 w-full border-gray-100 ${
                i > 0 && i <= categories.length - 1 ? "border-t" : ""
              }`}
            >
              {c.name}
            </Link>
          ))}
      </ul> */}
      {/* LINEA AL FINAL */}
      <div
        className={`w-full justify-center mt-5 transition-opacity duration-400 ${
          open ? "flex opacity-100" : "hidden opacity-0"
        }`}
      >
        <div className="rounded-md w-1/2 border border-gray-100" />
      </div>
    </div>
  );
};

export default Categories;
