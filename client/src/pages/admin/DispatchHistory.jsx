import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { adminApi } from "../../api/adminApi.js";
import { formatDate } from "../../utils/formatDate.js";

export const DispatchHistory = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const response = await adminApi.getDispatches();
        setDispatches(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch dispatches:", error);
        toast.error(error.response?.data?.message || "Failed to load dispatch history");
      } finally {
        setLoading(false);
      }
    };

    fetchDispatches();
  }, []);

  const columns = [
    { key: "dispatchNo", label: "Dispatch No" },
    { key: "shopName", label: "Shop", render: (val, row) => row.shopId?.name || "-" },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const s = String(val || "").toLowerCase();
        const v = s === "completed" ? "green" : s === "pending" ? "blue" : "gray";
        return <Badge variant={v}>{String(val || "-")}</Badge>;
      },
    },
    { key: "dispatchDate", label: "Date", render: (val) => formatDate(val) },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dispatch History</h1>

      <Card>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={dispatches}
            emptyState={
              <div>
                <div className="text-lg font-semibold">No dispatch history yet</div>
                <div className="text-sm mt-1">Create your first dispatch to see it here.</div>
              </div>
            }
          />
        )}
      </Card>
    </div>
  );
};