import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaBoxes,
  FaRupeeSign,
  FaUsers,
  FaChartBar,
  FaArrowUp,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";
import { DataTable } from "../../components/common/DataTable.jsx";
import { superAdminApi } from "../../api/superAdminApi.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchReport, setBranchReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await superAdminApi.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchReport = async (shopId) => {
    try {
      setReportLoading(true);
      const response = await superAdminApi.getBranchReport(shopId);
      setBranchReport(response.data.data);
      setSelectedBranch(shopId);
      setActiveTab("branch-details");
    } catch (error) {
      console.error("Failed to fetch branch report:", error);
      toast.error(error.response?.data?.message || "Failed to load branch report");
    } finally {
      setReportLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!dashboardData) return;

    let csvContent = "Branch Analytics Report\n";
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary
    csvContent += "SUMMARY\n";
    csvContent += `Total Branches,${dashboardData.summary.totalBranches}\n`;
    csvContent += `Total Products,${dashboardData.summary.totalProducts}\n`;
    csvContent += `Total Revenue,${dashboardData.summary.totalRevenue}\n`;
    csvContent += `Expected Revenue,${dashboardData.summary.totalExpectedRevenue}\n`;
    csvContent += `Total Staff,${dashboardData.summary.totalStaff}\n\n`;

    // Branch Analytics
    csvContent += "BRANCH-WISE ANALYTICS\n";
    csvContent += "Branch Name,Location,Owner,Stock Value,Actual Revenue,Expected Revenue,Transactions,Staff Count\n";
    dashboardData.branchAnalytics.forEach(branch => {
      csvContent += `${branch.shopName},${branch.location},${branch.ownerName},${branch.totalStockValue},${branch.actualRevenue},${branch.expectedRevenue},${branch.totalTransactions},${branch.staffCount}\n`;
    });

    csvContent += "\n\nPRODUCT DISTRIBUTION\n";
    csvContent += "Product Name,Category,Total Quantity,Branches Stocking,Revenue\n";
    dashboardData.productDistribution.forEach(product => {
      csvContent += `${product.productName},${product.category},${product.totalQuantity},${product.branchesStocking},${product.totalRevenue}\n`;
    });

    const link = document.createElement("a");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    link.href = URL.createObjectURL(blob);
    link.download = `branch-analytics-${new Date().getTime()}.csv`;
    link.click();

    toast.success("Report exported successfully!");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600">Failed to load dashboard data</p>
          <Button onClick={fetchDashboard} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const { summary, branchAnalytics, productDistribution } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Complete overview of all branches and operations</p>
        </div>
        <Button onClick={exportToCSV} variant="secondary" className="flex items-center gap-2">
          <FaDownload /> Export Report
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "overview", label: "Overview" },
          { id: "branches", label: "Branch Analytics" },
          { id: "products", label: "Product Distribution" },
          { id: "branch-details", label: "Branch Details", hidden: !selectedBranch }
        ].map(tab => (
          !tab.hidden && (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          )
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Branches */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Branches</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{summary.totalBranches}</p>
                  <p className="text-xs text-gray-500 mt-1">Active locations</p>
                </div>
                <FaStore className="text-2xl text-blue-500 opacity-20" />
              </div>
            </Card>

            {/* Total Products */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{summary.totalProducts}</p>
                  <p className="text-xs text-gray-500 mt-1">{summary.totalProductsStocked} stocked</p>
                </div>
                <FaBoxes className="text-2xl text-green-500 opacity-20" />
              </div>
            </Card>

            {/* Total Revenue */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{formatCurrency(summary.totalRevenue)}</p>
                  <p className="text-xs text-gray-500 mt-1">All transactions</p>
                </div>
                <FaRupeeSign className="text-2xl text-purple-500 opacity-20" />
              </div>
            </Card>

            {/* Expected Revenue */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expected Revenue</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(summary.totalExpectedRevenue)}</p>
                  <p className="text-xs text-gray-500 mt-1">Based on inventory</p>
                </div>
                <FaArrowUp className="text-2xl text-orange-500 opacity-20" />
              </div>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-cyan-600 mt-2">{summary.totalSalesTransactions}</p>
                <p className="text-xs text-gray-500 mt-1">Sales completed</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{summary.totalStaff}</p>
                <p className="text-xs text-gray-500 mt-1">Across all branches</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{summary.totalReturns}</p>
                <p className="text-xs text-gray-500 mt-1">Items returned</p>
              </div>
            </Card>
          </div>

          {/* Top Performing Branches */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaChartBar /> Top 5 Performing Branches
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Branch Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expected Revenue</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Transactions</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summary.topBranches.map((branch, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{branch.shopName}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{formatCurrency(branch.actualRevenue)}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{formatCurrency(branch.expectedRevenue)}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{branch.totalTransactions}</td>
                      <td className="px-6 py-3 text-sm">
                        <Badge variant={branch.expectedRevenue > branch.actualRevenue ? "warning" : "success"}>
                          {formatCurrency(branch.expectedRevenue - branch.actualRevenue)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* BRANCHES TAB */}
      {activeTab === "branches" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">All Branches Analytics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Branch</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Products</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Expected</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Gap</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Staff</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {branchAnalytics.map((branch) => {
                    const revenueDiff = branch.expectedRevenue - branch.actualRevenue;
                    const isUnderPerforming = revenueDiff > 0;

                    return (
                      <tr key={branch.shopId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{branch.shopName}</td>
                        <td className="px-4 py-3 text-gray-600">{branch.location}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{branch.productsCount}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{branch.totalStockValue}</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(branch.actualRevenue)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(branch.expectedRevenue)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={isUnderPerforming ? "warning" : "success"}>
                            {formatCurrency(Math.abs(revenueDiff))}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{branch.staffCount}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => fetchBranchReport(branch.shopId)}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1"
                            disabled={reportLoading}
                          >
                            <FaEye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Product Distribution Across Branches</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Total Qty</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Branches</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productDistribution.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{product.productName}</td>
                      <td className="px-4 py-3 text-gray-600">{product.category}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{product.totalQuantity}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="info">{product.branchesStocking}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(product.price)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(product.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* BRANCH DETAILS TAB */}
      {activeTab === "branch-details" && branchReport && (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{branchReport.branch.name}</h3>
              <p className="text-gray-500">{branchReport.branch.location}</p>
            </div>
            <Button onClick={() => setActiveTab("branches")} variant="secondary">
              Back
            </Button>
          </div>

          {/* Branch Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(branchReport.totalRevenue)}</p>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <p className="text-sm text-gray-600">Expected Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(branchReport.expectedRevenue)}</p>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <p className="text-sm text-gray-600">Gap</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(branchReport.revenueDifference)}</p>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">{branchReport.salesCount}</p>
            </Card>
          </div>

          {/* Inventory */}
          <Card>
            <h4 className="text-lg font-semibold mb-4">Current Inventory</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Product</th>
                    <th className="px-4 py-2 text-center font-semibold">Quantity</th>
                    <th className="px-4 py-2 text-center font-semibold">Unit Price</th>
                    <th className="px-4 py-2 text-right font-semibold">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {branchReport.inventory?.map((inv) => (
                    <tr key={inv._id}>
                      <td className="px-4 py-2 text-gray-900">{inv.productId?.name}</td>
                      <td className="px-4 py-2 text-center">{inv.quantity}</td>
                      <td className="px-4 py-2 text-center">{formatCurrency(inv.productId?.price || 0)}</td>
                      <td className="px-4 py-2 text-right font-medium">{formatCurrency((inv.productId?.price || 0) * inv.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
