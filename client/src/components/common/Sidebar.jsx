// src/components/common/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const linkBase =
  "block px-3 py-2 rounded-md font-medium transition";

const linkClass = ({ isActive }) =>
  `${linkBase} ${
    isActive ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
  }`;

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="bg-white w-64 border-r h-full p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-900">Menu</h2>

      {user?.role === "admin" && (
        <div className="space-y-2">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/dispatch" className={linkClass}>
            Create Dispatch
          </NavLink>
          <NavLink to="/admin/dispatch-history" className={linkClass}>
            Dispatch History
          </NavLink>
          <NavLink to="/admin/logs" className={linkClass}>
            Stock Ledger
          </NavLink>
          <NavLink to="/admin/reports" className={linkClass}>
            Reports
          </NavLink>
        </div>
      )}

      {user?.role === "shop" && (
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
          <NavLink to="/shop/returns" className={linkClass}>
            Returns
          </NavLink>
        </div>
      )}
    </aside>
  );
};