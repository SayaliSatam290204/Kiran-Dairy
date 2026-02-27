import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Card } from "../../components/ui/Card.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { shopApi } from "../../api/shopApi.js";

export const ShopDashboard = () => {
  const [stats, setStats] = useState({
    totalInventory: 0,
    totalSales: 0,
    totalReturns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await shopApi.getDashboard();
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shop Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Inventory">
            <p className="text-4xl font-bold text-green-600">{stats.totalInventory}</p>
            <p className="text-gray-600">Units in stock</p>
          </Card>

          <Card title="Total Sales">
            <p className="text-4xl font-bold text-blue-600">{stats.totalSales}</p>
            <p className="text-gray-600">Sales today</p>
          </Card>

          <Card title="Total Returns">
            <p className="text-4xl font-bold text-purple-600">{stats.totalReturns}</p>
            <p className="text-gray-600">Return requests</p>
          </Card>
        </div>
      )}

      <Card className="mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <p className="text-gray-600">No recent transactions</p>
      </Card>
    </div>
  );
};