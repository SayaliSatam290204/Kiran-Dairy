import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="bg-gray-100 w-64 p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      
      {user?.role === 'admin' && (
        <div className="space-y-4">
          <Link to="/admin/dashboard" className="block text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
          <Link to="/admin/dispatch" className="block text-blue-600 hover:text-blue-800">
            Create Dispatch
          </Link>
          <Link to="/admin/dispatch-history" className="block text-blue-600 hover:text-blue-800">
            Dispatch History
          </Link>
          <Link to="/admin/logs" className="block text-blue-600 hover:text-blue-800">
            Stock Ledger
          </Link>
          <Link to="/admin/reports" className="block text-blue-600 hover:text-blue-800">
            Reports
          </Link>
        </div>
      )}

      {user?.role === 'shop' && (
        <div className="space-y-4">
          <Link to="/shop/dashboard" className="block text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
          <Link to="/shop/inventory" className="block text-blue-600 hover:text-blue-800">
            Inventory
          </Link>
          <Link to="/shop/pos" className="block text-blue-600 hover:text-blue-800">
            POS Billing
          </Link>
          <Link to="/shop/sales" className="block text-blue-600 hover:text-blue-800">
            Sales History
          </Link>
          <Link to="/shop/returns" className="block text-blue-600 hover:text-blue-800">
            Returns
          </Link>
        </div>
      )}
    </aside>
  );
};
