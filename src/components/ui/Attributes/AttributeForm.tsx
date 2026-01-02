"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  AttributeType,
  AttributeValues,
  AttributeWithValues,
} from "@/lib/types/dbtypes";
import { Input } from "../input";
import { Button } from "../button";
import { CheckCircle2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../field";
import { Badge } from "../badge";

export interface FormAttributeTypes {
  id?: string; // solo existe en edición
  name: string;
  existingValues: AttributeValues[]; // los que vienen de la DB
  newValues: string[]; // valores nuevos
  deletedValueIds: string[]; // ids a borrar
}

interface AttributeFormProps {
  initialData?: AttributeWithValues;
  onSubmit: (
    attribute: FormAttributeTypes
  ) => Promise<{ ok: boolean; message: string }>;
}

const AttributeForm: React.FC<AttributeFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormAttributeTypes>({
    name: "",
    existingValues: [],
    newValues: [],
    deletedValueIds: [],
  });
  const [addValueInput, setAddValueInput] = useState<string>("");
  const [error, setError] = useState<{
    ok: boolean;
    message: string;
    show: boolean;
  }>({
    ok: false,
    message: "",
    show: false,
  });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  const onChangeAddValueInput = (e: ChangeEvent<HTMLInputElement>) => {
    setAddValueInput(e.target.value);
  };

  const handleSubmit = async () => {
    const result = await onSubmit(form);
    setError({ ...result, show: true });
  };
  const deleteValue = (id: string) => {
    setForm((prev) => ({
      ...prev,
      existingValues: [...prev.existingValues.filter((ev) => ev.id !== id)],
      deletedValueIds: [...prev.deletedValueIds, id],
    }));
  };
  const restoreForm = () => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        name: initialData.name,
        id: initialData.id,
        existingValues: [...initialData.attributeValues],
        newValues: [],
        deletedValueIds: [],
      }));
    }
  };
  useEffect(() => {
    const editMode = () => {
      if (initialData) {
        setForm((prev) => ({
          ...prev,
          name: initialData.name,
          id: initialData.id,
          existingValues: [...initialData.attributeValues],
        }));
      }
    };
    editMode();
  }, []);

  return (
    <div className="w-full p-5">
      <form>
        <FieldSet>
          <FieldLegend className="font-bold">Creando Atributo</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del atributo</FieldLabel>
              <Input
                value={form.name}
                name="name"
                placeholder="Nombre"
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel>Valores</FieldLabel>
              <div className="w-full grid grid-cols-6">
                <Input
                  name="valor"
                  placeholder="valor"
                  onChange={onChangeAddValueInput}
                  value={addValueInput}
                ></Input>
                <Button
                  type="button"
                  onClick={() => {
                    if (!addValueInput.trim()) return;

                    setForm((prev) => ({
                      ...prev,
                      newValues: [...prev.newValues, addValueInput.trim()],
                    }));
                    setAddValueInput("");
                  }}
                >
                  Agregar
                </Button>
              </div>
              <FieldSeparator></FieldSeparator>
              <Field>
                <p>Valores nuevos</p>
                <div>
                  {[
                    ...form.existingValues.map((attValue) => (
                      <Badge
                        className="bg-green-500"
                        key={attValue.id}
                        onClick={() => deleteValue(attValue.id)}
                      >
                        {attValue.value}
                      </Badge>
                    )),
                    ...form.newValues.map((newValue, index) => (
                      <Badge key={index} className="bg-green-400">
                        {newValue}
                      </Badge>
                    )),
                  ]}
                </div>
              </Field>
            </Field>
          </FieldGroup>
          <Button type="button" onClick={handleSubmit}>
            Guardar
          </Button>
        </FieldSet>
        {error.show ? (
          error.ok ? (
            <div className="absolute z-50 top-0 left-0 w-full h-full bg-white flex justify-center items-center">
              <div className="flex flex-col items-center space-y-5 w-full">
                <CheckCircle2 className="size-1/3 text-green-500" />
                <p className="text-green-500 font-bold">{error.message}</p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">{error.message}</p>
          )
        ) : null}
      </form>
    </div>
  );
};

export default AttributeForm;
