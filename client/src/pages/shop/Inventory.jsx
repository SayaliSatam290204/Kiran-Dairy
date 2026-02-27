import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { shopApi } from "../../api/shopApi.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await shopApi.getInventory();
        setInventory(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        toast.error(error.response?.data?.message || "Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const columns = [
    { key: "productName", label: "Product Name", render: (val, row) => row.productId?.name || "-" },
    { key: "quantity", label: "Quantity" },
    { key: "price", label: "Price", render: (val, row) => formatCurrency(row.productId?.price || 0) },
    {
      key: "status",
      label: "Status",
      render: (val, row) =>
        row.quantity > 0 ? <Badge variant="green">IN STOCK</Badge> : <Badge variant="red">OUT OF STOCK</Badge>,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inventory</h1>

      <Card>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={inventory}
            emptyState={
              <div>
                <div className="text-lg font-semibold">No products in inventory</div>
                <div className="text-sm mt-1">Wait for admin dispatch to receive stock.</div>
              </div>
            }
          />
        )}
      </Card>
    </div>
  );
};