"use client";
import { BaseProduct, CleanProduct, CleanVariant } from "@/lib/types/dbtypes";
import { UUID } from "crypto";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Button } from "../button";

import { DataTable } from "@/components/ui/DataTable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Skeleton } from "../skeleton";
import VariantForm, {
  VariantFormTypes,
} from "./product_variants/Form/VariantForm";
import { FieldSeparator } from "../field";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

interface ProductDetailsProps {
  id: UUID;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ id }) => {
  const [product, setProduct] = useState<CleanProduct | null>();
  const [createVariant, setCreateVariant] = useState(false);
  const [editVariant, setEditVariant] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState<string>("");
  const onCreateVariant = async (form: VariantFormTypes) => {
    console.log("SE LLAMA LA FUNCION DE CREAR VARIANTES", form);

    const response = await fetch("/api/product_variants", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        product_id: product?.product.id,
        productName: product?.product.name,
      }),
    }).then((res) => res.json());

    if (!response) {
      return {
        ok: false,
        message: response.message,
      };
    }

    return {
      ok: true,
      message: "La variante se creo correctamente.",
    };
  };
  const onEditVariant = async (form: VariantFormTypes) => {
    console.log("SE LLAMA LA FUNCION DE editar VARIANTES", form);

    const response = await fetch("/api/product_variants", {
      method: "PATCH",
      body: JSON.stringify({
        ...form,
        product_id: product?.product.id,
        productName: product?.product.name,
      }),
    }).then((res) => res.json());

    if (!response) {
      return {
        ok: false,
        message: response.message,
      };
    }

    return {
      ok: true,
      message: "La variante se creo correctamente.",
    };
  };
  const onDeleteVariant = async (id: string) => {
    try {
      const response = await fetch(`/api/product_variants/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());

      if (!response) throw response.error;

      const { variantId } = response;
      if (product) {
        setProduct((prev) => ({
          ...product,
          product_variants: [
            ...prev.product_variants.filter(
              (variant) => variant.id !== variantId
            ),
          ],
        }));
      }
    } catch (error) {
      console.log(error, "Ocurrio un error al intentar eliminar la variante");
    }
  };
  //COLUMNAS DE LA TABLA
  const columnHelper = createColumnHelper<CleanVariant>();
  const columns = [
    columnHelper.accessor("sku", { header: "Sku", meta: { label: "Sku" } }),
    columnHelper.accessor("price", {
      header: "Precio",
      meta: { label: "Precio" },
    }),
    columnHelper.accessor("stock", {
      header: "Stock",
      meta: { label: "Stock" },
    }),

    columnHelper.accessor(
      (row) => row.attributes.map((cat) => cat.name).join(""),
      {
        header: "Valores",
        meta: { label: "Attributos" },
        cell: ({
          row: {
            original: { attributes },
          },
        }) => (
          <Popover key={attributes.length}>
            <PopoverTrigger asChild>
              <button className="text-xs w-fit cursor-pointer underline">
                Ver atributos({attributes.length})
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit text-xs p-2">
              <ul>
                {attributes.map((attribute) => (
                  <li
                    key={attribute.attributeId}
                    className="flex justify-between space-x-2"
                  >
                    <span>{attribute.name}:</span>
                    <span>{attribute.value}</span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        ),
      }
    ),
    {
      id: "actions",
      header: () => <span className="block text-center">Acciones</span>,
      size: 200, // Exacto para 2 botones con iconos
      maxSize: 220, // No crece
      minSize: 120, // No se achica
      enableResizing: false,
      enableSorting: false,
      meta: { headerClassName: "text-center", cellClassName: "text-center" },
      cell: ({
        row: { original: variant },
      }: {
        row: { original: CleanVariant };
      }) => {
        return (
          <div className=" flex justify-end space-x-2 text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVariantToEdit(variant.id);
                setEditVariant(true);
              }}
              className="bg-gray-500 rounded-sm text-xs px-3 py-2 text-gray-100 font-bold"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteVariant(variant.id);
              }}
              className="bg-gray-700 rounded-sm text-xs px-3 py-2 text-gray-100 font-bold"
            >
              Eliminar
            </button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const loadProduct = async () => {
      const response = await fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .catch((error) =>
          console.log("Ocurrio un error al pedir el producto", error)
        );

      setProduct(response.data);
    };
    loadProduct();
  }, []);
  useEffect(() => {
    console.log("El variant id es", editVariant.variantId);
  }, [editVariant]);
  if (!product) {
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
    <div className="">
      <div className="flex flex-col w-full bg-gray-500">
        <div className="flex space-x-5 justify-between">
          <p>Producto </p>
          <p>{product.product.name}</p>
        </div>
        <div className="flex space-x-5 justify-between">
          <p>Descripcion:</p>
          <p>
            <span className="font-medium">{product.product.description}</span>
          </p>
        </div>
      </div>

      {/* <div className="w-full items-center px-2 h-12 font-bold border-b border-b-black flex justify-between">
        <div>
          <h1>Variantes del producto</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="bg-gray-900 text-white rounded-xs cursor-pointer px-3"
            >
              Crear variante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Crea una nueva variante de {product?.product.name}
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>

            <ProductVariantForm productId={id} />
          </DialogContent>
        </Dialog>
      </div> */}
      {/*Crear variante*/}
      <Dialog open={createVariant} onOpenChange={(e) => setCreateVariant(e)}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Crea una nueva variante de {product?.product.name}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <VariantForm onSubmit={onCreateVariant} />
        </DialogContent>
      </Dialog>
      {/*Editar variante*/}
      <Dialog open={editVariant} onOpenChange={(e) => setEditVariant(e)}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editando variante de {product?.product.name}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <VariantForm idVariant={variantToEdit} onSubmit={onEditVariant} />
        </DialogContent>
      </Dialog>
      <FieldSeparator className="my-2" />
      <div className="w-full flex justify-between px-2">
        <div className="text-xl font-semibold">
          <p>Variantes</p>
        </div>
        <Button
          type="button"
          onClick={() => setCreateVariant(true)}
          className="rounded-xs text-sm p-2"
        >
          Crear variante
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={product.product_variants}
        enableGlobalFilter={true}
        enableSorting={true}
        enablePagination={false}
      />
      {/* {product && (
        <Table>
          <TableCaption>Variantes del producto</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Precio</TableHead>
              <TableHead>Sku</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Attributos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto min-h-full text-black font-bold">
            {product.product_variants.map((variant) => (
              <TableRow
                key={variant.id}
                className="h-0 text-xs p-0 text-white bg-black"
              >
                <TableCell>{variant.price}</TableCell>
                <TableCell>{variant.sku}</TableCell>
                <TableCell>{variant.stock}</TableCell>
                <TableCell className="max-w-52 overflow-auto flex-nowrap py-1 space-x-px h-full bg-black">
                  <ScrollArea className="w-full bg-green-500 h-full">
                    <div className="flex flex-row gap-2 h-full ">
                      {variant.attributes.map((att) => (
                        <Badge key={att.attributeId}>{att.name}</Badge>
                      ))}
                      {variant.attributes.map((att) => (
                        <Badge key={att.attributeId}>{att.name}</Badge>
                      ))}
                      {variant.attributes.map((att) => (
                        <Badge key={att.attributeId}>{att.name}</Badge>
                      ))}
                      {variant.attributes.map((att) => (
                        <Badge key={att.attributeId}>{att.name}</Badge>
                      ))}
                      {variant.attributes.map((att) => (
                        <Badge key={att.attributeId}>{att.name}</Badge>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </TableCell>

                {/* <TableCell align="right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button type="button">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56"
                        align="start"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => deleteCategorie(cat.id)}
                          >
                            Eliminar
                            <DropdownMenuShortcut>
                              <Trash />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> 
                <TableCell className="w-0 space-x-2">
                  <Button
                    type="button"
                    className="text-white bg-gray-400 rounded-xs cursor-pointer select-none shadow-sm"
                    onClick={() => onEditVariant(true, variant.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    className="text-white bg-gray-500 rounded-xs cursor-pointer select-none shadow-sm"
                    onClick={() => onDeleteVariant(variant.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )} */}

      {/* {editVariant.edit && (
        <Dialog open={editVariant.edit} onOpenChange={openEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Crea una nueva variante de {product?.product.name}
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>

            {editVariant.variantId && (
              <ProductVariantForm
                productId={id}
                variantId={editVariant.variantId}
              />
            )}
          </DialogContent>
        </Dialog>
      )} */}
      <p>Editar</p>
    </div>
  );
};

export default ProductDetails;
