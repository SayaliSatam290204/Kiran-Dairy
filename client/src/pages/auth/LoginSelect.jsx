import React from "react";
import { Link } from "react-router-dom";

export const LoginSelect = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome</h1>
        <p className="text-center text-gray-600 mb-6">
          Choose how you want to login
        </p>

        <div className="space-y-3">
          <Link
            to="/admin-login"
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login as Admin
          </Link>

          <Link
            to="/shop-login"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Login as Shop
          </Link>
        </div>
      </div>
    </div>
  );
};