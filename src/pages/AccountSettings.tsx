// c:\Users\zainp\Desktop\stock-view-easy-find-main - Copy\stock-view-easy-find-main\src\pages\AccountSettings.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock } from "lucide-react"; // Removed Menu, Search
import { useAuth } from "@/contexts/AuthContext";
// Removed useTicker import
import Navbar from "@/components/Navbar"; // <-- Import the shared Navbar

const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, logout } = useAuth();
  // Removed setTicker import and usage
  const [loading, setLoading] = useState(false);



  const [formData, setFormData] = useState({
    username: user?.username || "JaneDoe",
    email: user?.email || "janedoe@example.com",
    name: user?.name || "Jane Doe",
    password: "********",
  });

  const [emailNotifications, setEmailNotifications] = useState(
    user?.emailNotifications ?? true
  );
  const [pushNotifications, setPushNotifications] = useState(
    user?.pushNotifications ?? false
  );

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || formData.username,
        email: user.email || formData.email,
        name: user.name || formData.name,
        password: "********",
      });
      setEmailNotifications(user.emailNotifications ?? true);
      setPushNotifications(user.pushNotifications ?? false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Removed Search Handler ---
  // const handleSearch = (e: React.FormEvent) => { ... };
  // --- End Removed Search Handler ---

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      if (!user?._id) {
        throw new Error("User ID not found. Cannot update settings.");
      }

      const response = await fetch('http://localhost:5000/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: user._id,
          ...(formData.name !== user.name && { name: formData.name }),
          ...(formData.email !== user.email && { email: formData.email }),
          ...(formData.username !== user.username && { username: formData.username }),
          ...(formData.password !== "********" && { password: formData.password }),
          emailNotifications,
          pushNotifications,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Update failed with non-JSON response' }));
        throw new Error(errorData.message || 'Update failed');
      }

      const updatedUserData = await response.json();

      updateUser(updatedUserData.user || {
        username: formData.username,
        email: formData.email,
        name: formData.name,
        emailNotifications,
        pushNotifications,
      });

      setFormData(prev => ({ ...prev, password: "********" }));

      toast({
        title: "Success",
        description: "Account settings updated successfully!",
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update account settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true);

      try {
        if (!user?._id) {
          throw new Error("User ID not found. Cannot delete account.");
        }

        const response = await fetch(`http://localhost:5000/api/user/${user._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Deletion failed with non-JSON response' }));
          throw new Error(errorData.message || 'Deletion failed');
        }

        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully.",
        });

        logout();
      } catch (error) {
        console.error("Error deleting account:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete account",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        title: "Authentication Required",
        description: "Please log in to view account settings.",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stockify-dark text-stockify-text">
      {/* --- Use the shared Navbar --- */}
      <header className="p-4 sticky top-0 bg-stockify-dark/90 backdrop-blur-sm z-10">
        {/* Adjust padding/styling if needed */}
        <Navbar />
      </header>
      {/* --- End Shared Navbar Usage --- */}

      {/* --- Removed the old custom header block --- */}
      {/* <header className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-stockify-dark/90 backdrop-blur-sm z-10">
        ... old header code ...
      </header> */}
      {/* --- End Removed Header --- */}

      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        <h1 className="text-2xl font-semibold mb-8">Account Settings</h1>

        {/* Avatar Section */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-blue-400">
               {user?.username ? (
                 <span className="text-white text-3xl font-medium">{user.username.charAt(0).toUpperCase()}</span>
               ) : (
                 <User size={40} className="text-white" />
               )}
            </div>
          </div>
          <div>
            <div className="mb-1 text-lg font-medium">{formData.name}</div>
            <div className="text-gray-400 text-sm">
              @{formData.username}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-400">Receive email alerts for price changes</div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                aria-label="Toggle email notifications"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-400">Receive push notifications for news updates</div>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                aria-label="Toggle push notifications"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-[#222] border border-gray-800 pl-10"
                  aria-label="Full name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#222] border border-gray-800 pl-10"
                  aria-label="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password to change"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-[#222] border border-gray-800 pl-10"
                  aria-label="New password (optional)"
                />
              </div>
               <p className="text-xs text-gray-500 mt-1">Leave as '********' to keep current password.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-800 pt-6 flex flex-wrap gap-4">
          <Button
            onClick={handleSaveChanges}
            disabled={loading}
            className="bg-[#1976d2] hover:bg-[#1565c0] text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="destructive"
            disabled={loading}
            className="bg-red-800 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
