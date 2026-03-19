import { useContext, useState } from "react";
import { FiKey } from "react-icons/fi";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContextProvider";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function Settings() {
  const { token } = useContext(authContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
        password: currentPassword,  
        newPassword: newPassword,   
      },
        { headers: { token } },
      );
    },
    onMutate: () => setIsSaving(true),
    onSuccess: () => {
      toast.success("Password updated ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error updating password ❌",
      );
    },
    onSettled: () => setIsSaving(false),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required ❌");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    changePasswordMutation.mutate();
  };

  return (
    <main className="min-w-0 bg-bg dark:bg-bg-dark min-h-screen flex justify-center py-10">
      <div className="mx-auto max-w-2xl w-full">
        <section className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-primary">
              <FiKey size={18} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-text dark:text-text-dark sm:text-2xl">
                Change Password
              </h1>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                Keep your account secure by using a strong password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-text dark:text-text-dark">
                Current password
              </span>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark px-3 py-2.5 text-sm text-text dark:text-text-dark outline-none transition focus:border-primary focus:bg-hover dark:focus:bg-hover-dark"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-text dark:text-text-dark">
                New password
              </span>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark px-3 py-2.5 text-sm text-text dark:text-text-dark outline-none transition focus:border-primary focus:bg-hover dark:focus:bg-hover-dark"
              />
              <span className="mt-1 block text-xs text-text-muted dark:text-text-muted-dark">
                At least 8 characters with uppercase, lowercase, number, and
                special character.
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-text dark:text-text-dark">
                Confirm new password
              </span>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark px-3 py-2.5 text-sm text-text dark:text-text-dark outline-none transition focus:border-primary focus:bg-hover dark:focus:bg-hover-dark"
              />
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary hover:bg-primary-hover px-4 py-2.5 text-sm font-bold text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
