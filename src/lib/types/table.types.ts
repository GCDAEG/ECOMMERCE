// types/table.types.ts  (o en cualquier archivo .d.ts)
import "@tanstack/react-table";
import { Row, Table } from "@tanstack/react-table";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    // Puedes agregar más propiedades que uses en meta
    align?: "left" | "center" | "right";
    // Ej: meta: { align: 'center' }
    hideOnMobile?: boolean;
    label?: string;
  }
}

export type DataTableViewProps<TData> = {
  table: Table<TData>;
  onRowClick?: (row: TData) => void;
  rows: Row<TData>[];
};
