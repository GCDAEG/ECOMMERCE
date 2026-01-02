// types/table.types.ts  (o en cualquier archivo .d.ts)
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    // Puedes agregar más propiedades que uses en meta
    align?: 'left' | 'center' | 'right';
    // Ej: meta: { align: 'center' }
  }
}