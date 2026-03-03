import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/adminApi.js";
import { Card } from "../../components/ui/Card.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";

export const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState({
    totalAlerts: 0,
    criticalCount: 0,
    lowCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [filterShop, setFilterShop] = useState("");
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchAlertCounts();
    fetchAlerts();
    fetchShops();

    // Refresh alerts every 30 seconds
    const interval = setInterval(() => {
      fetchAlerts();
      fetchAlertCounts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filterShop) {
      fetchAlerts(filterShop);
    }
  }, [filterShop]);

  const fetchShops = async () => {
    try {
      const response = await adminApi.getAllShops();
      setShops(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    }
  };

  const fetchAlertCounts = async () => {
    try {
      const response = await adminApi.getAlertCount();
      setAlertCount(response.data.data);
    } catch (error) {
      console.error("Failed to fetch alert count:", error);
    }
  };

  const fetchAlerts = async (shopId = "") => {
    try {
      setLoading(true);
      const response = await adminApi.getStockAlerts(shopId || undefined);
      setAlerts(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch stock alerts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (quantity) => {
    if (quantity === 0) return "bg-red-50 border-red-200";
    if (quantity <= 5) return "bg-orange-50 border-orange-200";
    return "bg-yellow-50 border-yellow-200";
  };

  const getAlertBadge = (status) => {
    switch (status) {
      case "OUT_OF_STOCK":
        return <Badge variant="red">OUT OF STOCK</Badge>;
      case "CRITICAL":
        return <Badge className="bg-orange-200 text-orange-800">CRITICAL</Badge>;
      case "LOW":
        return <Badge className="bg-yellow-200 text-yellow-800">LOW STOCK</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Alerts & Monitoring</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Alerts */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
          <div>
            <div className="text-sm text-gray-600">Total Low Stock Items</div>
            <div className="text-4xl font-bold text-yellow-700 mt-2">
              {alertCount.totalAlerts}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Products with ≤20 units
            </div>
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300">
          <div>
            <div className="text-sm text-gray-600">Critical / Out of Stock</div>
            <div className="text-4xl font-bold text-red-700 mt-2">
              {alertCount.criticalCount}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Require immediate action
            </div>
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
          <div>
            <div className="text-sm text-gray-600">Low Stock</div>
            <div className="text-4xl font-bold text-orange-700 mt-2">
              {alertCount.lowCount}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Between 5-20 units
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <label className="block text-sm font-semibold mb-2">Filter by Shop</label>
        <select
          value={filterShop}
          onChange={(e) => setFilterShop(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Shops</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name} ({shop.location})
            </option>
          ))}
        </select>
      </Card>

      {/* Alerts List */}
      {loading ? (
        <Card>
          <div className="text-center py-10">Loading alerts...</div>
        </Card>
      ) : alerts.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">✅ No low stock items!</p>
            <p className="text-gray-500 text-sm mt-1">All products have healthy stock levels.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={`${alert._id}`}
              className={`border-2 rounded-lg p-4 ${getAlertColor(alert.quantity)}`}
            >
              {/* Alert Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">
                    {alert.productId?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    SKU: {alert.productId?.sku} | {alert.shopId?.name} ({alert.shopId?.location})
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  {getAlertBadge(alert.alertStatus)}
                </div>
              </div>

              {/* Alert Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600">Current Stock</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {alert.quantity}
                  </div>
                  <div className="text-xs text-gray-600">units</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600">Unit Price</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(alert.productId?.price || 0)}
                  </div>
                  <div className="text-xs text-gray-600">per {alert.productId?.unit}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600">Stock Value</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      (alert.productId?.price || 0) * alert.quantity
                    )}
                  </div>
                  <div className="text-xs text-gray-600">total</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600">Category</div>
                  <Badge className="text-sm mt-1">
                    {alert.productId?.category}
                  </Badge>
                  <div className="text-xs text-gray-600 mt-1">
                    Last updated: {new Date(alert.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              {alert.recentTransactions && alert.recentTransactions.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Recent Transactions (Last 5)
                  </p>
                  <div className="space-y-1">
                    {alert.recentTransactions.map((tx) => (
                      <div key={tx._id} className="flex justify-between text-xs text-gray-600">
                        <span>
                          {tx.transactionType.toUpperCase()} {tx.quantity} units
                        </span>
                        <span>{new Date(tx.transactionDate).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Alert */}
              <div className="mt-4 p-3 bg-white/50 rounded border text-sm">
                <strong>⚠️ Action Required:</strong> Stock level is{" "}
                {alert.alertStatus === "OUT_OF_STOCK"
                  ? "zero"
                  : alert.alertStatus === "CRITICAL"
                  ? "critically low"
                  : "below recommended level"}
                . Consider restocking this product.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <Card className="bg-gray-50">
        <h3 className="font-semibold mb-3">Alert Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-2 items-center">
            <Badge variant="red">OUT OF STOCK</Badge>
            <span>0 units - Critical, can't sell</span>
          </div>
          <div className="flex gap-2 items-center">
            <Badge className="bg-orange-200 text-orange-800">CRITICAL</Badge>
            <span>1-5 units - Very low stock</span>
          </div>
          <div className="flex gap-2 items-center">
            <Badge className="bg-yellow-200 text-yellow-800">LOW STOCK</Badge>
            <span>6-20 units - Below threshold</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
