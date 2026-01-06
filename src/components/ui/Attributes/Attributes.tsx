"use client";
import { AttributeWithValues, BaseProduct } from "@/lib/types/dbtypes";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { CheckCircle2, EllipsisVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import AttributeForm, { FormAttributeTypes } from "./AttributeForm";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "../badge";
import { DataTable } from "@/components/ui/DataTable/DataTable";

const Attributes = ({}) => {
  const [attributesWithValues, setAttributesWithValues] = useState<
    AttributeWithValues[]
  >([]);
  const [createAttributeForm, setCreateAttributeForm] = useState(false);
  const [editAttributeForm, setEditAttributeForm] = useState<{
    edit: boolean;
    attributesWithValues: AttributeWithValues;
  }>({
    edit: false,
    attributesWithValues: { id: "", name: "", attributeValues: [] },
  });
  const router = useRouter();

  //functions
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/attributes/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());
      if (response.error) {
        alert(response.error);
        throw "Error";
      }

      setAttributesWithValues((prev) => [
        ...prev.filter((att) => att.id !== id),
      ]);
    } catch (error) {
      console.log(error, "JA");
    }
  };

  //CREAR ATRIBUTO
  const createAttribute = async (e: FormAttributeTypes) => {
    const response = await fetch("/api/attributes", {
      method: "POST",
      body: JSON.stringify({
        ...e,
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.log(error, "Este es el error"));
    console.log(response.data, "Respuesta");
    if (!response) {
      return {
        ok: false,
        message: "Error al crear el atributo.",
      };
    }
    setTimeout(() => setCreateAttributeForm(false), 1500);
    setAttributesWithValues((prev) => [...prev, response.data]);
    return {
      ok: true,
      message: "Atributo creado exitosamente.",
    };
  };
  //editar atributo
  const handleEditAttribute = async (form: FormAttributeTypes) => {
    const response = await fetch(`/api/attributes/${form.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...form,
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.log(error, "Este es el error"));
    console.log(response, "Respuesta");
    if (!response) {
      return {
        ok: false,
        message: "Error al crear el atributo.",
      };
    }
    if (response.error) {
      return {
        ok: false,
        message: response.error,
      };
    }
    setTimeout(() => setCreateAttributeForm(false), 1500);
    setAttributesWithValues((prev) => [
      ...prev.map((attwv) => {
        if (attwv.id === response.data.attribute.id) {
          const survivingValues = attwv.attributeValues.filter(
            (value) => !form.deletedValueIds.includes(value.id)
          );
          return {
            ...response.data.attribute,
            attributeValues: [...survivingValues, ...response.data.newValues],
          };
        }
        return attwv;
      }),
    ]);
    // {
    //     data: {
    //       attribute,
    //       newValues: insertedValues,
    //     },
    //     message: "Atributo actualizado correctamente",
    //   }
    return {
      ok: true,
      message: response.message,
    };
  };
  //COLUMNAS DE LA TABLA
  const columnHelper = createColumnHelper<AttributeWithValues>();
  const columns = [
    columnHelper.accessor("name", { header: "Nombre" }),
    columnHelper.accessor("attributeValues", {
      header: "Valores",
      cell: (info) =>
        info
          .getValue()
          .map((value) => <Badge key={value.id}>{value.value}</Badge>),
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
      cell: ({
        row: { original: attribute },
      }: {
        row: { original: AttributeWithValues };
      }) => {
        return (
          <div className=" flex justify-end space-x-2">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditAttributeForm(() => ({
                  edit: true,
                  attributesWithValues: attribute,
                }));
              }}
              className="bg-gray-500"
            >
              Editar
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(attribute.id);
              }}
              className="bg-gray-700"
            >
              Eliminar
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const loadAttributesWithValues = async () => {
      try {
        const response = await fetch("/api/attributes").then((res) =>
          res.json()
        );

        if (!response) throw "Hubo un error al obtener los atributos";
        console.log("Data recibida", response.data);
        setAttributesWithValues(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadAttributesWithValues();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full h-12 border-b border-gray-400 flex items-center px-2 justify-between">
        <div>
          <h1 className="text-xl font-bold">Atributos</h1>
        </div>
        <Button
          type="button"
          className="cursor-pointer rounded-xs"
          onClick={() => setCreateAttributeForm(true)}
        >
          Crear atributo
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={attributesWithValues}
        enableGlobalFilter={true}
        enableSorting={true}
        enablePagination={false}
        onRowClick={(attributesWithValues) =>
          router.push(`/admin/attributes/${attributesWithValues.id}`)
        }
      />
      {/* <Table>
        <TableCaption>Lista de categorias</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Valores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {attributesWithValues
            ? attributesWithValues.map((att) => (
                <TableRow
                  key={att.id}
                  onClick={() => router.push(`/admin/attributes/${att.id}`)}
                  className="odd:bg-gray-200 even:bg-gray-100"
                >
                  <TableCell>{att.name}</TableCell>
                  <TableCell>{att.attributeValues.length}</TableCell>
                  <TableCell
                    className="w-0 space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="button"
                      onClick={() => {}}
                      className="bg-gray-500"
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleDelete(att.id)}
                      className="bg-gray-700"
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table> */}
      <Dialog open={createAttributeForm} onOpenChange={setCreateAttributeForm}>
        <DialogContent className="p-0">
          <AttributeForm onSubmit={createAttribute} />
        </DialogContent>
      </Dialog>
      {/* editar */}
      <Dialog
        open={editAttributeForm.edit}
        onOpenChange={(e) =>
          setEditAttributeForm((prev) => ({ ...prev, edit: e }))
        }
      >
        <DialogContent className="p-0">
          <AttributeForm
            onSubmit={handleEditAttribute}
            initialData={editAttributeForm.attributesWithValues}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attributes;
