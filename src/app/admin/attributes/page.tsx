"use client";
import React, { useEffect, useState } from "react";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    //OBTENER ATRIBUTOS
    const fetchAttributes = async () => {
      const res = await fetch("/api/attributes");
      const data = await res.json();
      setAttributes(data);
    };
    fetchAttributes();
  }, []);
  //CREAR ATRIBUTO
  const createAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const respuesta = await fetch("/api/attributes", {
      method: "POST",
      body: JSON.stringify({
        type: "attributes",
        name,
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.log(error, "Este es el error"));
    console.log(respuesta, "Respuesta");
    setName("");
  };
  return (
    <div className="component-name">
      <h1>atributos</h1>
      {/* FORMULARIO CREAR ATRIBUTO */}
      <form
        onSubmit={createAttribute}
        className="flex gap-2 border p-4 rounded-lg mb-6"
      >
        <input
          type="text"
          placeholder="Nombre del atributo (ej: Color)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Crear
        </button>
      </form>
      {/* LISTA DE ATRIBUTOS */}
      <div className="space-y-2">
        {attributes.map((attr) => (
          <a
            key={attr.id}
            href={`/admin/attributes/${attr.id}`}
            className="block p-4 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <div className="font-semibold">{attr.name}</div>
            <div className="text-sm text-gray-500">
              {attr.attribute_values?.length || 0} valores
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Page;
