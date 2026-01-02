"use client";
import { BaseProduct, Categorie } from "@/lib/types/dbtypes";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CategorieForm, { CategorieFormType } from "./categorieForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Button } from "../button";
import { Skeleton } from "../skeleton";
interface CategorieWithProducts extends Categorie {
  products: BaseProduct[];
}

const CategorieDetails = () => {
  const { id } = useParams();
  const [CategorieWithProducts, setCategorieWithProducts] =
    useState<CategorieWithProducts | null>(null);
  const [editCategorieForm, setEditCategorieForm] = useState(false);
  const handleEditCategorie = async (form: CategorieFormType) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        return {
          ok: false,
          message: "No se pudo editar la categoria",
        };
      }
      const { data } = await response.json();
      console.log(data, "AGVFADASD");
      if (CategorieWithProducts) {
        setCategorieWithProducts({
          ...CategorieWithProducts,
          name: data.name,
        });
      }
      return {
        ok: true,
        message: "Categoria editada exitosamente",
      };
    } catch (error) {
      return { ok: false, message: "Error de servidor" };
    }
  };
  useEffect(() => {
    const loadCategorieWithProdcuts = async () => {
      const response = await fetch(`/api/categories/${id}`).then((res) =>
        res.json()
      );

      if (!response) console.log("No se pudo obtener la categoria", response);
      console.log(response, "CATEGORIA");
      setCategorieWithProducts(response.data);
    };
    loadCategorieWithProdcuts();
  }, []);

  if (!CategorieWithProducts) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* {CategorieWithProducts ? (
        <CategorieForm
          onSubmit={handleEditCategorie}
          initialData={{
            name: CategorieWithProducts.name,
            slug: CategorieWithProducts.slug,
          }}
          legend="Editar categoria"
        />
      ) : null} */}
      <div className="flex px-3 pt-2">
        <div className="w-full h-12 flex items-center text-3xl">
          <p>Categoria {CategorieWithProducts.name}</p>
        </div>
        <Dialog open={editCategorieForm} onOpenChange={setEditCategorieForm}>
          <DialogTrigger asChild>
            <Button type="button" className="cursor-pointer rounded-xs">
              Editar
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
              onSubmit={handleEditCategorie}
              initialData={{
                name: CategorieWithProducts.name,
                slug: CategorieWithProducts.slug,
              }}
              legend="Editar categoria"
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableCaption>
          {CategorieWithProducts.products.length > 0
            ? "Productos"
            : "No hay productos con esta categoria"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Precio</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripcion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto min-h-full">
          {CategorieWithProducts.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="">{product.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategorieDetails;
