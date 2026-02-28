import { Modal } from "./ui/Modal.jsx";
import { Badge } from "./ui/Badge.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

export const StaffPerformanceModal = ({ isOpen, onClose, staff, performance }) => {
  if (!staff || !performance) return null;

  const { daily = [], weekly = {}, monthly = {}, yearly = {} } = performance;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${staff.name} - Performance Metrics`}>
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Staff Information Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{staff.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{staff.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{staff.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Salary</p>
              <p className="font-semibold text-gray-900">₹{staff.baseSalary}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {staff.shifts?.map(shift => (
              <Badge key={shift} className="capitalize">
                {shift} Shift
              </Badge>
            ))}
          </div>
        </div>

        {/* Daily Performance Breakdown */}
        {daily.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Daily Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {daily.map((day, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">{day.date || day.shift || `Day ${idx + 1}`}</span>
                    {day.shift && <Badge className="text-xs capitalize">{day.shift}</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Sales</p>
                      <p className="font-semibold text-gray-900">{day.totalSales || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(day.totalAmount || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Items</p>
                      <p className="font-semibold text-gray-900">{day.itemsSold || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Sale</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(day.avgSaleAmount || 0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Performance */}
        {Object.keys(weekly).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-blue-600">{weekly.totalSales || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(weekly.totalAmount || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Items Sold</p>
                <p className="text-2xl font-bold text-purple-600">{weekly.itemsSold || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600 mb-1">Avg Sale</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(weekly.avgSaleAmount || 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Performance */}
        {Object.keys(monthly).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
                <p className="text-xs text-gray-600 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-cyan-600">{monthly.totalSales || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
                <p className="text-xs text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-teal-600">{formatCurrency(monthly.totalAmount || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-lime-50 to-lime-100 p-4 rounded-lg border border-lime-200">
                <p className="text-xs text-gray-600 mb-1">Items Sold</p>
                <p className="text-2xl font-bold text-lime-600">{monthly.itemsSold || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                <p className="text-xs text-gray-600 mb-1">Avg Sale</p>
                <p className="text-2xl font-bold text-pink-600">{formatCurrency(monthly.avgSaleAmount || 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Yearly Performance */}
        {Object.keys(yearly).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Yearly Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <p className="text-xs text-gray-600 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-red-600">{yearly.totalSales || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(yearly.totalAmount || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                <p className="text-xs text-gray-600 mb-1">Items Sold</p>
                <p className="text-2xl font-bold text-indigo-600">{yearly.itemsSold || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg border border-violet-200">
                <p className="text-xs text-gray-600 mb-1">Avg Sale</p>
                <p className="text-2xl font-bold text-violet-600">{formatCurrency(yearly.avgSaleAmount || 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {daily.length === 0 && Object.keys(weekly).length === 0 && Object.keys(monthly).length === 0 && Object.keys(yearly).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No performance data available yet</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
