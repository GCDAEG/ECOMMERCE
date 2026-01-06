// components/MobileCards.tsx
import { flexRender } from "@tanstack/react-table";
import { DataTableViewProps } from "../../../lib/types/table.types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export function MobileCards<TData>({
  table,
  onRowClick,
  rows,
}: DataTableViewProps<TData>) {
  console.log(table.getRowModel().rows, "ROWS");
  return (
    <div className="md:hidden space-y-3 px-2">
      {rows.map((row) => (
        <Card key={row.id} onClick={() => onRowClick?.(row.original)}>
          <CardHeader>
            <CardTitle>Producto</CardTitle>
            <CardDescription>{row.getValue("description")}</CardDescription>
            {/*<CardAction>Card Action</CardAction>*/}
          </CardHeader>
          <CardContent>
            {row
              .getVisibleCells()
              .filter(
                (cell) =>
                  !cell.column.columnDef.meta?.hideOnMobile &&
                  cell.column.id !== "actions"
              )
              .map((cell) => (
                <div key={cell.id} className="flex justify-between py-1">
                  <span className="text-sm text-gray-500">
                    {cell.column.columnDef.meta?.label ?? ""}
                  </span>
                  <span className="font-medium text-right flex flex-wrap space-x-px justify-end">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
          </CardContent>
          <CardFooter className="flex justify-end ">
            {row
              .getVisibleCells()
              .filter((cell) => cell.column.id === "actions")
              .map((cell) => (
                <div key={cell.column.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
