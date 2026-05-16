import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { authApi } from "../../lib/api";
import { brand, ROLES, ROLE_LABELS } from "../../config/brand";
import { useToast } from "../../hooks/useToast";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
  jobTitle: z.string().optional(),
  role: z.enum(["PROJECT_LEAD", "QUALITY_REVIEWER", "TASKER"]),
  qualityReviewerId: z.string().optional(),
});

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("TASKER");
  const [reviewers, setReviewers] = useState([]);
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    authApi.reviewers().then((r) => setReviewers(r.data.data.reviewers)).catch(() => {});
  }, []);

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const regForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "TASKER" },
  });

  const onLogin = async (data) => {
    try {
      await login(data);
      toast("Welcome back", "success");
      navigate("/dashboard");
    } catch (e) {
      toast(e.response?.data?.error?.message || "Login failed", "error");
    }
  };

  const onRegister = async (data) => {
    try {
      await register({ ...data, role });
      toast("Account created", "success");
      navigate("/dashboard");
    } catch (e) {
      toast(e.response?.data?.error?.message || "Registration failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="auth-watermark">
        <span>TASK TRACK</span>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal font-bold text-bg">
            {brand.shortName}
          </div>
          <div>
            <h1 className="text-xl font-bold">{brand.name}</h1>
            <p className="text-xs text-muted">{brand.tagline}</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "login" ? "bg-teal text-bg" : "border border-border text-muted hover:text-text"
            }`}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              mode === "register" ? "bg-teal text-bg" : "border border-border text-muted hover:text-text"
            }`}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>

        {mode === "register" && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Select role</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(ROLES)
                .filter((r) => r !== "ADMIN")
                .map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      role === r ? "border-teal text-teal" : "border-border text-muted hover:border-teal/50"
                    }`}
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
            </div>
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-muted">Email</label>
              <input
                {...loginForm.register("email")}
                placeholder="you@ethara.ai"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-muted">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  {...loginForm.register("password")}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pr-10 text-sm outline-none focus:border-teal"
                />
                <button type="button" className="absolute right-3 top-2.5 text-muted" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" className="accent-teal" defaultChecked /> Remember me
            </label>
            <button type="submit" className="w-full rounded-lg bg-teal py-3 font-semibold text-bg hover:opacity-90">
              Sign In →
            </button>
            <p className="text-center text-xs text-muted">
              Demo: abhishek.singh23@ethara.ai / Admin123!
            </p>
          </form>
        ) : (
          <form onSubmit={regForm.handleSubmit(onRegister)} className="space-y-3">
            <input {...regForm.register("name")} placeholder="Full name" className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm" />
            <input {...regForm.register("jobTitle")} placeholder="Job title (e.g. ILM Intern)" className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm" />
            {role === "TASKER" && (
              <select {...regForm.register("qualityReviewerId")} className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm">
                <option value="">Select Quality Reviewer</option>
                {reviewers.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}
            <input {...regForm.register("email")} placeholder="you@ethara.ai" className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm" />
            <input type="password" {...regForm.register("password")} placeholder="Password" className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm" />
            <button type="submit" className="w-full rounded-lg bg-teal py-3 font-semibold text-bg">
              Create Account →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
