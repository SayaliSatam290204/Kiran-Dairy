import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi.js";

export const SetupRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await authApi.adminExists();
        const exists = res.data.exists;

        if (exists) navigate("/login", { replace: true });
        else navigate("/admin/register", { replace: true });
      } catch (err) {
        // fallback if server down
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white border rounded-xl p-8 text-center max-w-md w-full">
        <h2 className="text-lg font-bold mb-2">Loading...</h2>
        <p className="text-gray-600">Checking setup status</p>
      </div>
    </div>
  );
};