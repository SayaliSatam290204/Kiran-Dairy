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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-300 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-500 pl-5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Name</p>
              <p className="text-2xl font-extrabold text-gray-900">{staff.name}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Salary</p>
              <p className="text-2xl font-extrabold text-green-700">₹{staff.baseSalary || 0}</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Email</p>
              <p className="text-base font-semibold text-gray-900 break-all">{staff.email || 'N/A'}</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Phone</p>
              <p className="text-base font-semibold text-gray-900">{staff.phone || 'N/A'}</p>
            </div>
          </div>
          {staff.shifts && staff.shifts.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t-2 border-blue-300">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest w-full">Shift Details</p>
              {staff.shifts.map(shift => (
                <Badge key={shift} className="capitalize bg-blue-200 text-blue-800 px-3 py-1 text-sm font-semibold">
                  {shift} Shift
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Daily Performance Breakdown */}
        {daily.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Daily Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
              {daily.map((day, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-300">
                    <span className="text-base font-bold text-gray-900">{day.date || day.shift || `Day ${idx + 1}`}</span>
                    {day.shift && <Badge className="text-xs capitalize bg-indigo-100 text-indigo-700">{day.shift}</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sales</p>
                      <p className="text-xl font-bold text-blue-600">{day.totalSales || 0}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Revenue</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(day.totalAmount || 0)}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items</p>
                      <p className="text-xl font-bold text-purple-600">{day.itemsSold || 0}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avg Sale</p>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(day.avgSaleAmount || 0)}</p>
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
            <h3 className="text-xl font-bold text-gray-900">Weekly Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border-2 border-blue-300 shadow-sm">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Total Sales</p>
                <p className="text-3xl font-bold text-blue-600">{weekly.totalSales || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border-2 border-green-300 shadow-sm">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Revenue</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(weekly.totalAmount || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border-2 border-purple-300 shadow-sm">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Items Sold</p>
                <p className="text-3xl font-bold text-purple-600">{weekly.itemsSold || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border-2 border-orange-300 shadow-sm">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">Avg Sale</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(weekly.avgSaleAmount || 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Performance */}
        {Object.keys(monthly).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Monthly Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-lg border-2 border-cyan-300 shadow-sm">
                <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider mb-2">Total Sales</p>
                <p className="text-3xl font-bold text-cyan-600">{monthly.totalSales || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-lg border-2 border-teal-300 shadow-sm">
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Revenue</p>
                <p className="text-3xl font-bold text-teal-600">{formatCurrency(monthly.totalAmount || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-lime-50 to-lime-100 p-5 rounded-lg border-2 border-lime-300 shadow-sm">
                <p className="text-xs font-bold text-lime-700 uppercase tracking-wider mb-2">Items Sold</p>
                <p className="text-3xl font-bold text-lime-600">{monthly.itemsSold || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-lg border-2 border-pink-300 shadow-sm">
                <p className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-2">Avg Sale</p>
                <p className="text-3xl font-bold text-pink-600">{formatCurrency(monthly.avgSaleAmount || 0)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Yearly Performance */}
        {Object.keys(yearly).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Yearly Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border-2 border-red-300 shadow-sm">
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Total Sales</p>
                <p className="text-3xl font-bold text-red-600">{yearly.totalSales || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg border-2 border-yellow-300 shadow-sm">
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Revenue</p>
                <p className="text-3xl font-bold text-yellow-600">{formatCurrency(yearly.totalAmount || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg border-2 border-indigo-300 shadow-sm">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">Items Sold</p>
                <p className="text-3xl font-bold text-indigo-600">{yearly.itemsSold || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-5 rounded-lg border-2 border-violet-300 shadow-sm">
                <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">Avg Sale</p>
                <p className="text-3xl font-bold text-violet-600">{formatCurrency(yearly.avgSaleAmount || 0)}</p>
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
