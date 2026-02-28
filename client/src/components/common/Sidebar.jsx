// src/components/common/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { returnApi } from "../../api/returnApi.js";

const linkBase = "block px-3 py-2 rounded-md font-medium transition";

const linkClass = ({ isActive }) =>
  `${linkBase} ${
    isActive ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
  }`;

export const Sidebar = () => {
  const { user } = useAuth();

  // Pending returns count (admin only)
  const [pendingCount, setPendingCount] = useState(0);
  const [lastNotifiedCount, setLastNotifiedCount] = useState(0);

  const isAdmin = user?.role === "admin";
  const isShop = user?.role === "shop";

  useEffect(() => {
    if (!isAdmin) return;

    let timer;

    const fetchPending = async () => {
      try {
        const res = await returnApi.getPendingCount();
        const count = res.data?.data?.count ?? 0;

        setPendingCount(count);

        // Optional toast when new return comes
        if (count > lastNotifiedCount) {
          const diff = count - lastNotifiedCount;
          toast.success(
            diff === 1
              ? "New return request received!"
              : `${diff} new return requests received!`
          );
          setLastNotifiedCount(count);
        }

        // initialize lastNotifiedCount on first successful fetch
        if (lastNotifiedCount === 0 && count > 0) {
          setLastNotifiedCount(count);
        }
      } catch (e) {
        // silent fail to avoid annoying user
      }
    };

    fetchPending();
    timer = setInterval(fetchPending, 15000); // every 15 sec

    return () => clearInterval(timer);
  }, [isAdmin, lastNotifiedCount]);

  return (
    <aside className="bg-white w-64 border-r min-h-screen p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-900">Menu</h2>

      {isAdmin && (
        <div className="space-y-2">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/dispatch" className={linkClass}>
            Dispatch
          </NavLink>

          <NavLink to="/admin/dispatch-history" className={linkClass}>
            Dispatch History
          </NavLink>

          <NavLink to="/admin/dispatch-analytics" className={linkClass}>
            Dispatch Analytics
          </NavLink>

          <NavLink to="/admin/logs" className={linkClass}>
            Stock Ledger
          </NavLink>

          <NavLink to="/admin/reports" className={linkClass}>
            Reports
          </NavLink>

          {/* Returns with badge */}
          <NavLink to="/admin/returns" className={linkClass}>
            <div className="flex items-center justify-between">
              <span>Returns</span>

              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white">
                  {pendingCount}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink to="/admin/shops" className={linkClass}>
            Shop Management
          </NavLink>

          <hr className="my-3" />

          <NavLink to="/admin/staff" className={linkClass}>
            Staff Management
          </NavLink>

          <NavLink to="/admin/staff-payment" className={linkClass}>
            Staff Payments
          </NavLink>
        </div>
      )}

      {isShop && (
        <div className="space-y-2">
          <NavLink to="/shop/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/shop/inventory" className={linkClass}>
            Inventory
          </NavLink>

          <NavLink to="/shop/pos" className={linkClass}>
            POS Billing
          </NavLink>

          <NavLink to="/shop/sales" className={linkClass}>
            Sales History
          </NavLink>

          <NavLink to="/shop/dispatch" className={linkClass}>
            Dispatch Confirmation
          </NavLink>

          <NavLink to="/shop/returns" className={linkClass}>
            Returns
          </NavLink>

          <hr className="my-3" />

          <NavLink to="/shop/staff" className={linkClass}>
            Our Staff
          </NavLink>

          <NavLink to="/shop/payment" className={linkClass}>
            Staff Payments
          </NavLink>
        </div>
      )}
    </aside>
  );
};