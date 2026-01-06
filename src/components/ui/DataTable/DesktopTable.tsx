"use client";
import React, { useEffect } from "react";
import { flexRender } from "@tanstack/react-table";
import { DataTableViewProps } from "../../../lib/types/table.types";

export default function DesktopTable<TData>({
  table,
  onRowClick,
  rows,
}: DataTableViewProps<TData>) {
  console.log(table.getState().globalFilter);
  console.log(table.getRowModel().rows);
  console.log(table.getAllColumns());
  return (
    <div className="hidden md:block overflow-x-auto">
      {table.getState().globalFilter}
      <table
        className="min-w-full border-collapse border border-gray-300"
        style={{
          width: `${table.getTotalSize()}px`, // ← Fix clave: ancho total basado en sumatoria de sizes
        }}
      >
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border border-gray-300 px-4 py-2 text-left ${
                    header.column.columnDef.meta?.headerClassName || ""
                  }`}
                  style={{
                    width: `${header.getSize()}px`, // ← Fix: ancho en px
                    minWidth: `${header.column.columnDef.minSize ?? 0}px`,
                    maxWidth: `${header.column.columnDef.maxSize ?? "auto"}`,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-gray-50 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick?.(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`border border-gray-300 px-4 py-2 ${
                    cell.column.columnDef.meta?.cellClassName || ""
                  }`}
                  style={{
                    width: `${cell.column.getSize()}px`, // ← Opcional, pero refuerza
                    overflow: "hidden", // Para evitar que contenido largo expanda
                    textOverflow: "ellipsis",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
