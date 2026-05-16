import { useForm } from "react-hook-form";
import { useAuth } from "../lib/auth";
import { usersApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useToast } from "../hooks/useToast";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, avatar: user?.avatar },
  });

  const onProfile = async (data) => {
    try {
      await usersApi.updateMe(data);
      await refreshUser();
      toast("Profile updated", "success");
    } catch {
      toast("Update failed", "error");
    }
  };

  const onPassword = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await usersApi.updatePassword({
        currentPassword: fd.get("currentPassword"),
        newPassword: fd.get("newPassword"),
      });
      toast("Password updated", "success");
      e.target.reset();
    } catch (err) {
      toast(err.response?.data?.error?.message || "Password update failed", "error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <Card>
        <h2 className="mb-4 font-semibold">Profile</h2>
        <form onSubmit={handleSubmit(onProfile)} className="space-y-4">
          <Input label="Name" {...register("name")} />
          <Input label="Avatar URL" {...register("avatar")} />
          <Button type="submit">Save</Button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-4 font-semibold">Password</h2>
        <form onSubmit={onPassword} className="space-y-4">
          <Input label="Current password" name="currentPassword" type="password" required />
          <Input label="New password" name="newPassword" type="password" required />
          <Button type="submit">Update password</Button>
        </form>
      </Card>
    </div>
  );
}
