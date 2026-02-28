import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { returnApi } from "../../api/returnApi.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await returnApi.getAll();
        setReturns(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch returns:", error);
        toast.error(error.response?.data?.message || "Failed to load returns");
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const columns = [
    { key: "returnNo", label: "Return No" },

    {
      key: "status",
      label: "Status",
      render: (val) => {
        const s = String(val || "").toLowerCase();
        const v = s === "approved" ? "green" : s === "rejected" ? "red" : "blue";
        return <Badge variant={v}>{String(val || "-")}</Badge>;
      }
    },

    {
      key: "items",
      label: "Items",
      render: (items) => (Array.isArray(items) ? items.length : 0)
    },

    {
      key: "items",
      label: "Products",
      render: (items) =>
        Array.isArray(items) && items.length
          ? items
              .map((it) => `${it?.productId?.name || "Product"} x${it.quantity}`)
              .join(" | ")
          : "—"
    },

    {
      key: "items",
      label: "Reasons",
      render: (items) =>
        Array.isArray(items) && items.length
          ? items.map((it) => it.reason).filter(Boolean).join(", ")
          : "—"
    },

    {
      key: "totalRefund",
      label: "Refund",
      render: (val) => formatCurrency(val || 0)
    },

    {
      key: "returnDate",
      label: "Date",
      render: (val) => formatDate(val)
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Returns</h1>

      <Card>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={returns}
            emptyState={
              <div>
                <div className="text-lg font-semibold">No returns yet</div>
                <div className="text-sm mt-1">Return requests will appear here.</div>
              </div>
            }
          />
        )}
      </Card>
    </div>
  );
};