import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Kiran Dairy Farm</h1>
      <div className="flex items-center gap-4">
        <span>{user?.name}</span>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
