import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/authApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isDev = import.meta?.env?.DEV;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    if (isDev) {
      if (role === "admin") {
        setEmail("admin@kiran-dairy.com");
        setPassword("admin123");
      } else {
        setUsername("Kiran-Dairy-Mumbai");
        setPassword("demo123");
      }
    }

    setError("");
  };

  const handleBackToRoleSelect = () => {
    setSelectedRole(null);
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({
        email: selectedRole === "admin" ? email : undefined,
        username: selectedRole === "shop" ? username : undefined,
        password
      });

      const { token, user } = response.data.data;

      if (user.role !== selectedRole) {
        setError(
          `This account is not a ${selectedRole} account. Please use the correct credentials.`
        );
        toast.error(`Account role mismatch. Expected ${selectedRole}, got ${user.role}`);
        setLoading(false);
        return;
      }

      console.log("Login successful. User data:", user);

      login(user, token);

      const dashboardRoute =
        selectedRole === "admin" ? "/admin/dashboard" : "/shop/dashboard";

      toast.success(
        `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} login successful!`
      );
      navigate(dashboardRoute);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Kiran Dairy
          </h1>
          <p className="text-center text-gray-600 mb-8">Choose your role to continue</p>

          <div className="space-y-3">
            <button
              onClick={() => handleRoleSelect("admin")}
              className="w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <span className="block"> Login as Admin</span>
            </button>

            <button
              onClick={() => handleRoleSelect("shop")}
              className="w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <span className="block">Login as Shop</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const textColor = selectedRole === "admin" ? "blue" : "green";
  const bgColor = selectedRole === "admin" ? "bg-blue-50" : "bg-green-50";
  const buttonColor =
    selectedRole === "admin"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-green-600 hover:bg-green-700";

  return (
    <div className={`flex items-center justify-center min-h-screen ${bgColor}`}>
      <Card
        className="w-96"
        title={`${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login`}
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedRole === "admin" ? (
            <Input
              label="Email"
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          ) : (
            <Input
              label="Shop Name (Username)"
              type="text"
              placeholder="Enter shop name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          )}

          <div className="space-y-2">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={`text-xs text-${textColor}-600 hover:text-${textColor}-800 font-semibold`}
              disabled={loading}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <Button type="submit" disabled={loading} className={`w-full ${buttonColor}`}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-300 space-y-3">
          <button
            type="button"
            onClick={handleBackToRoleSelect}
            className="w-full text-center py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
            disabled={loading}
          >
            ← Back to role selection
          </button>
        </div>
      </Card>
    </div>
  );
};