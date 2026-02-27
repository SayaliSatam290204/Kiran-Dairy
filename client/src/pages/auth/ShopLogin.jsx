// src/pages/auth/ShopLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/authApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";

export const ShopLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const isDev = import.meta?.env?.DEV;

  const [email, setEmail] = useState(isDev ? "shop1@kiran-dairy.com" : "");
  const [password, setPassword] = useState(isDev ? "admin123" : "");
  const [loading, setLoading] = useState(false);

  // simple show/hide password toggle
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const { token, user } = response.data.data;

      login(user, token);

      toast.success("Shop login successful");
      navigate("/shop/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96" title="Shop Login">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="shop@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <div className="space-y-2">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              disabled={loading}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-300 space-y-2">
          <p className="text-center text-gray-600 text-sm">
            Admin?{" "}
            <button
              type="button"
              onClick={() => navigate("/admin-login")}
              className="text-blue-600 hover:text-blue-800 font-semibold"
              disabled={loading}
            >
              Login here
            </button>
          </p>

          <p className="text-center text-gray-600 text-sm">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-gray-900 font-semibold"
              disabled={loading}
            >
              Back to role selection
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};