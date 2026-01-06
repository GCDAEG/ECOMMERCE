import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
interface ordersProps {
  orders: any[];
}
export const Orders: React.FC<ordersProps> = ({ orders }) => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">My Orders</h1>

      {orders.length === 0 && (
        <p className="text-sm opacity-70">You have no orders yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="rounded-2xl shadow p-2">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Order ID:</span>
                <span className="opacity-70">{order.id}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{order.status}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium">Total:</span>
                <span>${order.total}</span>
              </div>

              <Button
                variant="ghost"
                className="flex justify-between w-full p-0 h-8"
              >
                View details
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
