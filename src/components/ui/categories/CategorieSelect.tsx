"use client";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { ProductFormState } from "../Products/productForm";
import { FieldLabel } from "../field";
import { Categorie } from "@/lib/types/dbtypes";
import { Button } from "../button";
import { Plus, X } from "lucide-react";

interface CategorieSelectProps {
  categories: Categorie[];
  form: ProductFormState;
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>;
}

const CategorieSelect: React.FC<CategorieSelectProps> = ({
  categories,
  form,
  setForm,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Categorie[]>([]);
  const onValueChange = (value: string) => {
    console.log(value, "Esto envia el select");
    const selectedCategory = categories.filter((cat) => cat.id === value)[0];
    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories, selectedCategory],
    }));
    setSelectedCategories((prev) => [...prev, selectedCategory]);
    setOpen(false);
  };
  const removeCategorie = (value: string) => {
    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories.filter((c) => c.id !== value)],
    }));
    setSelectedCategories((prev) => [...prev.filter((cs) => cs.id !== value)]);
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full">
        <FieldLabel asChild>
          <div className=" w-full flex justify-between">
            <div>
              <p>Categorias</p>
            </div>
            <Button
              type="button"
              className="rounded-full  h-2  text-xs cursor-pointer disabled:opacity-50"
              disabled={open}
              onClick={() => setOpen(true)}
            >
              <p>Añadir</p>
              <Plus />
            </Button>
          </div>
        </FieldLabel>
        <div className="grid grid-cols-4 w-full gap-2">
          {form.categories.map((cat) => {
            return (
              <div
                key={cat.id}
                className="py-2 h-8 justify-evenly px-0 col-span-1 bg-gray-700 text-white rounded-xs flex items-center text-xs"
              >
                <p>{cat.name}</p>
                <button
                  className="w-4 hover:text-red-500 cursor-pointer shadow-md"
                  onClick={() => removeCategorie(cat.id)}
                >
                  <X className="w-full" />
                </button>
              </div>
            );
          })}
          {open ? (
            <div className="col-span-1">
              <div className="text-sm flex justify-between items-center">
                <div className=" w-full">
                  <Button
                    className="w-3 rounded-full cursor-pointer hover:bg-transparent bg-transparent text-black p-0"
                    onClick={() => setOpen(false)}
                  >
                    <X className="w-full" />
                  </Button>
                </div>
              </div>
              <Select onValueChange={onValueChange}>
                <SelectTrigger
                  className="w-full text-xs bg-gray-600 text-white"
                  iconColor="text-white"
                >
                  <p className="text-xs truncate text-gray-50">Seleccionar</p>
                </SelectTrigger>

                <SelectContent content="No hay">
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    {categories.map((cat) => {
                      return (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}
          {/* <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-fit h-fit col-span-1 rounded-md shadow-md hover:bg-green-300 cursor-pointer">
              <p>+</p>
            </PopoverTrigger>
            <PopoverContent>
              <div className="h-32 w-52 bg-blue-300">
                <Select onValueChange={onValueChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorías</SelectLabel>
                      {categories
                        .filter((cat) => {
                          const [categorieIsSelected] =
                            selectedCategories.filter((sc) => cat.id === sc.id);

                          return categorieIsSelected ? false : true;
                        })
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover> */}
        </div>
      </div>
    </div>
  );
};

export default CategorieSelect;
