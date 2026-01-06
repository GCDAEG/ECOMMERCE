"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { BaseProduct, Categorie } from "@/lib/types/dbtypes";
import CategorieForm, { CategorieFormType } from "./categorieForm";
import { useRouter } from "next/navigation";
import { EllipsisVertical, Pointer, Settings, Trash } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "../button";
import { DataTable } from "@/components/ui/DataTable/DataTable";
import { Badge } from "../badge";

interface CategorieWithProducts extends Categorie {
  products: BaseProduct[];
}
const Categories = ({}) => {
  const router = useRouter();
  const [categoriToEdit, setCategoriToEdit] = useState<{
    initialData: { name: string; slug: string; id: string };
    edit: boolean;
  }>({
    initialData: { name: "", slug: "" },
    edit: false,
  });
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<
    CategorieWithProducts[]
  >([]);
  const [confirmDelete, setConfirmDelete] = useState<{
    dialog: boolean;
    category: { id: string; name: string };
  }>({
    dialog: false,
    category: {
      id: "",
      name: "",
    },
  });
  const columnHelper = createColumnHelper<CategorieWithProducts>();
  const [createCategoriForm, setCreateCategoriForm] = useState(false);
  const handleCreateCategorie = async (form: CategorieFormType) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        return { ok: false, message: "Error al crear la categoría" };
      }
      setTimeout(() => setCreateCategoriForm(false), 1500);
      return { ok: true, message: "Categoría creada exitosamente" };
    } catch (error) {
      return { ok: false, message: "Error de servidor" };
    }
  };
  const handleEditCategorie = async (form: CategorieFormType) => {
    try {
      const response = await fetch(
        `/api/categories/${categoriToEdit.initialData.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(form),
        }
      );
      if (!response.ok) {
        return {
          ok: false,
          message: "No se pudo editar la categoria",
        };
      }
      setTimeout(
        () => setCategoriToEdit((prev) => ({ ...prev, edit: false })),
        1500
      );
      const { data } = await response.json();
      console.log(data, "AGVFADASD");
      if (categoriesWithProducts) {
        setCategoriesWithProducts((prev) =>
          prev.map((prevCategory) => {
            if (prevCategory.id === data.id) {
              return {
                ...prevCategory,
                ...data,
              };
            }
            return prevCategory;
          })
        );
      }
      return {
        ok: true,
        message: "Categoria editada exitosamente",
      };
    } catch (error) {
      return { ok: false, message: "Error de servidor" };
    }
  };
  const deleteCategorie = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw "Ocurrio un error al intentar borrar la categoria";
      console.log("Se borro correctamente la categoria.");
      setConfirmDelete((prev) => ({ ...prev, dialog: false }));
      setCategoriesWithProducts([
        ...categoriesWithProducts.filter((cat) => cat.id !== id),
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  //COLUMNAS DE LA TABLA
  const columns = [
    columnHelper.accessor("name", { header: "Nombre" }),
    columnHelper.accessor("products", {
      header: "Productos",
      cell: (info) =>
        info
          .getValue()
          .map((product) => <Badge key={product.id}>{product.name}</Badge>),
    }),
    {
      id: "actions",
      header: () => <span className="block text-center">Acciones</span>,
      size: 200, // Exacto para 2 botones con iconos
      maxSize: 220, // No crece
      minSize: 120, // No se achica
      enableResizing: false,
      enableSorting: false,
      meta: { headerClassName: "text-center", cellClassName: "text-center" },
      cell: ({ row: { original: cat } }: { row: { original: Categorie } }) => {
        return (
          <div className=" flex justify-end space-x-2">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCategoriToEdit(() => ({
                  initialData: {
                    name: cat.name,
                    slug: cat.slug,
                    id: cat.id,
                  },
                  edit: true,
                }));
              }}
              className="rounded-xs bg-gray-500"
            >
              Editar
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(() => ({
                  dialog: true,
                  category: { name: cat.name, id: cat.id },
                }));
              }}
              className="rounded-xs bg-gray-700"
            >
              Eliminar
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetch("/api/categories").then((res) => res.json());

      if (!response) {
        console.log("Ocurrio un error al pedir las categorias");
      }
      console.log("Obteniendo categorias", response);
      setCategoriesWithProducts(response.data);
    };
    loadCategories();
  }, []);

  return (
    <div className="w-full border">
      <div className="flex justify-between p-2 border-b border-gray-400">
        <p className="text-3xl font-semibold">Categorias</p>

        <Dialog open={createCategoriForm} onOpenChange={setCreateCategoriForm}>
          <DialogTrigger asChild>
            <Button type="button" className="cursor-pointer rounded-xs">
              Crear categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea una nueva categoria</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>

            <CategorieForm
              onSubmit={handleCreateCategorie}
              legend="Crear categoria"
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        data={categoriesWithProducts}
        enableSorting={true}
        enableGlobalFilter={true}
        enablePagination={false}
        columns={columns}
      />
      {/* <Table>
        <TableCaption>Lista de categorias</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Productos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto min-h-full ">
          {categoriesWithProducts
            ? categoriesWithProducts.map((cat, index) => (
                <TableRow
                  key={cat.id}
                  onClick={() => router.push(`/admin/categories/${cat.id}`)}
                  className="odd:bg-gray-200 even:bg-gray-100 cursor-pointer"
                >
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell>{cat.products.length}</TableCell>
                  <TableCell align="right" className="w-0 space-x-2">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoriToEdit(() => ({
                          initialData: {
                            name: cat.name,
                            slug: cat.slug,
                            id: cat.id,
                          },
                          edit: true,
                        }));
                      }}
                      className="rounded-xs bg-gray-500"
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(() => ({
                          dialog: true,
                          category: { name: cat.name, id: cat.id },
                        }));
                      }}
                      className="rounded-xs bg-gray-700"
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table> */}
      {/* Confirm delete */}
      <Dialog
        open={confirmDelete.dialog}
        onOpenChange={(e) =>
          setConfirmDelete((prev) => ({ ...prev, dialog: e }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              ¿<span className="font-normal">Seguro que quiere </span>
              <span>eliminar la categoria </span>
              {confirmDelete.category.name}?
            </DialogTitle>
          </DialogHeader>

          <Button
            type="button"
            onClick={() => deleteCategorie(confirmDelete.category.id)}
            className="cursor-pointer"
          >
            Eliminar
          </Button>
        </DialogContent>
      </Dialog>
      {/* Edit category */}

      <div className="w-full h-12 flex items-center text-3xl">
        <p>
          Categoria{" "}
          {categoriToEdit.initialData ? categoriToEdit.initialData.name : ""}
        </p>
      </div>
      <Dialog
        open={categoriToEdit.edit}
        onOpenChange={(e) =>
          setCategoriToEdit((prev) => ({ ...prev, edit: e }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crea una nueva categoria</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <CategorieForm
            onSubmit={handleEditCategorie}
            initialData={categoriToEdit.initialData}
            legend="Editar categoria"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
