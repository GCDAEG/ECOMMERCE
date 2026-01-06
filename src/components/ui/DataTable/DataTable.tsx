// components/DataTable.tsx

import React, { useState } from "react";
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
import { Search } from "lucide-react";
import { Input } from "../input";
import DesktopTable from "./DesktopTable";
import { MobileCards } from "./MobileCards";

export type DataTableProps<TData> = {
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
  enableGlobalFilter = true,
  onRowClick,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableGlobalFilter ? getFilteredRowModel() : undefined,

    globalFilterFn: "includesString",
  });

  return (
    <div className="w-full">
      {/* Filtro global */}
      {enableGlobalFilter && (
        <div className="mb-4">
          <div className="w-1/2 flex border rounded items-center relative bg-gray-700 text-gray-200">
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar en toda la tabla..."
              className="px-4 py-2 rounded w-full max-w-md outline-0 border-0 text-g"
            />
            <div className="p-2">
              <Search className="text-white relative z-50 w-5" />
            </div>
          </div>
        </div>
      )}
      <DesktopTable
        table={table}
        onRowClick={onRowClick}
        rows={table.getRowModel().rows}
      />
      <MobileCards
        table={table}
        onRowClick={onRowClick}
        rows={table.getRowModel().rows}
      />
    </div>
  );
}
