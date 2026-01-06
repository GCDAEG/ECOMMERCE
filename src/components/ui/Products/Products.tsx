"use client";
import { BaseProduct } from "@/lib/types/dbtypes";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../button";
import { Skeleton } from "../skeleton";
import { useRouter } from "next/navigation";
import ProductForm, { ProductFormState } from "./productForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import { Badge } from "../badge";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable/DataTable";
const Products = ({}) => {
  const [products, setProducts] = useState<BaseProduct[]>([]);
  const [createProductForm, setCreateProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<{
    initialData: BaseProduct;
    edit: boolean;
  }>({
    initialData: {
      name: "",
      slug: "",
      description: "",
      id: "0-0-0-0-0",
      price: 0,
      active: false,
      discount_price: null,
      categories: [],
    },
    edit: false,
  });
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

  const router = useRouter();
  const createProduct = async (form: ProductFormState) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (!res) throw "No se pudo crear el producto.";

      setProducts((prev) => [...prev, res.data]);
      setTimeout(() => setCreateProductForm(false), 1500);
      return {
        ok: true,
        message: "Se creo el producto.",
      };
    } catch (error: any) {
      console.log(error);
      return {
        ok: false,
        message: error,
      };
    }
  };
  const editProduct = async (form: BaseProduct) => {
    try {
      const res = await fetch(`/api/products/${form.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (!res) throw "No se pudo editar el producto.";
      console.log("RESPUESTA", res);
      setProducts((prev) => [
        ...prev.map((product) => {
          if (product.id === res.data.id) {
            return { ...res.data };
          }
          return product;
        }),
      ]);
      setTimeout(
        () => setProductToEdit((prev) => ({ ...prev, edit: false })),
        1500
      );
      return {
        ok: true,
        message: "Se edito el producto.",
      };
    } catch (error: any) {
      console.log(error);
      return {
        ok: false,
        message: error,
      };
    }
  };
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw "Ocurrio un error al intentar borrar el producto.";
      console.log("Se borro correctamente el producto.");
      setProducts([...products.filter((product) => product.id !== id)]);
      setConfirmDelete((prev) => ({ ...prev, dialog: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const onClickRow = (product: BaseProduct) => {
    router.push(`/admin/products/${product.id}`);
  };
  //COLUMNAS DE LA TABLA
  //COLUMNAS DE LA TABLA
  const columnHelper = createColumnHelper<BaseProduct>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Nombre",
        meta: { label: "Nombre" },
        enableGlobalFilter: true,
      }),
      columnHelper.accessor(
        (row) => row.categories.map((cat) => cat.name).join(""),
        {
          header: "Categorias",
          meta: { label: "Categorias" },
          cell: ({
            row: {
              original: { categories },
            },
          }) =>
            categories.map((cat) => (
              <Badge key={cat.id} className="text-xs">
                {cat.name}
              </Badge>
            )),
        }
      ),
      columnHelper.accessor(
        (row) => row.product_variants.map((variant) => variant.sku).join(""),
        {
          header: "Variantes",
          meta: { label: "Variantes" },
          cell: ({
            row: {
              original: { product_variants },
            },
          }) =>
            product_variants.map((variant) => (
              <Badge key={variant.id} className="text-xs">
                {variant.sku}
              </Badge>
            )),
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
          row: { original: product },
        }: {
          row: { original: BaseProduct };
        }) => {
          return (
            <div className=" flex justify-end space-x-2">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProductToEdit({ initialData: product, edit: true });
                }}
                className="bg-gray-500"
              >
                Editar
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(() => ({
                    dialog: true,
                    category: { name: product.name, id: product.id },
                  }));
                }}
                className="bg-gray-700"
              >
                Eliminar
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products").then((res) => res.json());

        if (!response) throw "No se pudo cargar los productos";
        console.log(response.data, "Respuesta");
        setProducts([...response.data]);
      } catch (error) {
        console.log(error);
      }
    };
    loadProducts();
  }, []);

  if (!products.length) {
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
      <div className="w-full h-12 flex justify-between items-center px-2">
        <div>
          <h1 className="font-bold text-xl">Productos</h1>
        </div>
        <div>
          <Button
            type="button"
            className="rounded-xs"
            onClick={() => setCreateProductForm(true)}
          >
            Crear producto
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={products}
        enableGlobalFilter={true}
        enableSorting={true}
        enablePagination={false}
        onRowClick={onClickRow}
      />
      {/* <Table>
        <TableCaption>Lista de categorias</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead>Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="odd:bg-gray-200 even:bg-gray-100"
              onClick={() => router.push(`/admin/products/${product.id}`)}
            >
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                {product.categories.map((cat) => (
                  <Badge key={cat.id}>{cat.name}</Badge>
                ))}
              </TableCell>

              <TableCell
                className="w-0 space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToEdit({ initialData: product, edit: true });
                  }}
                  className="bg-gray-500"
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(() => ({
                      dialog: true,
                      category: { name: product.name, id: product.id },
                    }));
                  }}
                  className="bg-gray-700"
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
              <span>eliminar el producto </span>
              {confirmDelete.category.name}?
            </DialogTitle>
          </DialogHeader>

          <Button
            type="button"
            onClick={() => deleteProduct(confirmDelete.category.id)}
            className="cursor-pointer"
          >
            Eliminar
          </Button>
        </DialogContent>
      </Dialog>
      {/* Create product */}
      <Dialog open={createProductForm} onOpenChange={setCreateProductForm}>
        <DialogContent>
          <DialogTitle>Crear producto</DialogTitle>
          <ProductForm onSubmit={createProduct} />
        </DialogContent>
      </Dialog>
      {/* Edit product */}
      <Dialog
        open={productToEdit.edit}
        onOpenChange={(e) => setProductToEdit((prev) => ({ ...prev, edit: e }))}
      >
        <DialogContent>
          <DialogTitle>Editar producto</DialogTitle>
          <ProductForm
            onSubmit={editProduct}
            initialData={productToEdit.initialData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
