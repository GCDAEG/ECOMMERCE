// components/DataTable.tsx

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableGlobalFilter?: boolean;
  pageSize?: number;
  onRowClick?: (row: TData) => void;
};

export function DataTable<TData>({
  data,
  columns,
  enableSorting = true,
  enablePagination = true,
  enableGlobalFilter = false,
  pageSize = 10,
  onRowClick,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && {
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    ...(enableGlobalFilter && {
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      getFilteredRowModel: getFilteredRowModel(),
    }),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: { pageSize },
    },
    initialState: {
      pagination: { pageSize },
    },
  });

  return (
    <div className="w-full">
      {/* Filtro global */}
      {enableGlobalFilter && (
        <div className="mb-4">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar en toda la tabla..."
            className="px-4 py-2 border rounded w-full max-w-md"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table
          className="min-w-full border-collapse border border-gray-300"
          style={{
            width: `${table.getTotalSize()}px`, // ← Fix clave: ancho total basado en sumatoria de sizes
            tableLayout: "fixed", // ← Fix: fuerza anchos estrictos
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
                    {...(enableSorting &&
                      header.column.getCanSort() && {
                        onClick: header.column.getToggleSortingHandler(),
                        style: { cursor: "pointer" },
                      })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {(enableSorting &&
                      {
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string]) ??
                      null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
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

      {/* Paginación */}
      {enablePagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <span>
            Página <strong>{table.getState().pagination.pageIndex + 1}</strong>{" "}
            de <strong>{table.getPageCount()}</strong>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
