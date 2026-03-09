import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { FaUser, FaEdit, FaLock, FaSignOutAlt } from "react-icons/fa";

export const AdminProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // States
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authApi.getProfile();
      setProfile(response.data.data);
      setEditForm({
        name: response.data.data.name,
        email: response.data.data.email,
      });
    } catch (error) {
      toast.error("Failed to fetch profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!editForm.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await authApi.updateProfile({
        name: editForm.name,
        email: editForm.email,
      });

      setProfile(response.data.data);
      
      // Update user in context and localStorage
      const updatedUser = {
        name: response.data.data.name,
        email: response.data.data.email,
      };
      updateUser(updatedUser);

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordForm.password) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword === passwordForm.password) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      setIsSaving(true);
      await authApi.changePassword({
        password: passwordForm.password,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setConfirmLogout(true);
  };

  const doLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {(profile?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{profile?.name}</h1>
            <p className="text-gray-600">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaUser className="text-blue-600" /> Profile Information
            </h2>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: profile?.name,
                      email: profile?.email,
                    });
                  }}
                  className="bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg text-gray-900 mt-1">{profile?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg text-gray-900 mt-1">{profile?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="text-lg text-blue-600 mt-1 font-semibold">
                    {profile?.role?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Member Since
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Password Change Card */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaLock className="text-blue-600" /> Security Settings
            </h2>
            {!isChangingPassword && (
              <Button
                onClick={() => setIsChangingPassword(true)}
                className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
              >
                <FaLock /> Change Password
              </Button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      password: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Keep your account secure by changing your password regularly.
            </p>
          )}
        </div>
      </Card>

      {/* Logout Card */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaSignOutAlt className="text-red-600" /> Logout
              </h2>
              <p className="text-gray-600 mt-2">
                You will be logged out of the system.
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </Button>
          </div>
        </div>
      </Card>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Confirm Logout"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to logout? You'll need to login again to access the dashboard.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={doLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Yes, Logout
          </Button>
          <Button
            onClick={() => setConfirmLogout(false)}
            className="bg-gray-400 hover:bg-gray-500"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
