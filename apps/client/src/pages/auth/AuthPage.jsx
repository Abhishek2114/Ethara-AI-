import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, Eye, EyeOff, ArrowRight } from "lucide-react";
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-muted hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent/30";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="auth-watermark">
        <span>TASK TRACK</span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo + brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-white">
            {brand.shortName}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">{brand.name}</h1>
          <p className="mt-1 text-sm text-muted">{brand.tagline}</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xl shadow-black/20">
          {/* Tabs */}
          <div className="mb-6 flex rounded-lg bg-surface p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-elevated text-text shadow-sm"
                  : "text-muted hover:text-text-secondary"
              }`}
            >
              <LogIn size={15} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-elevated text-text shadow-sm"
                  : "text-muted hover:text-text-secondary"
              }`}
            >
              <UserPlus size={15} /> Register
            </button>
          </div>

          {/* Role selector (register mode) */}
          {mode === "register" && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Select role</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(ROLES)
                  .filter((r) => r !== "ADMIN")
                  .map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        role === r
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-muted hover:border-border-hover hover:text-text-secondary"
                      }`}
                    >
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Login form */}
          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
                <input
                  {...loginForm.register("email")}
                  placeholder="you@ethara.ai"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    {...loginForm.register("password")}
                    placeholder="Enter your password"
                    className={inputClass + " pr-10"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-muted hover:text-text-secondary"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="rounded accent-accent" defaultChecked /> Remember me
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
              >
                Sign In <ArrowRight size={16} />
              </button>
              <p className="text-center text-xs text-muted">
                Demo: abhishek.singh23@ethara.ai / Admin123!
              </p>
            </form>
          ) : (
            <form onSubmit={regForm.handleSubmit(onRegister)} className="space-y-3">
              <input {...regForm.register("name")} placeholder="Full name" className={inputClass} />
              <input {...regForm.register("jobTitle")} placeholder="Job title (e.g. ILM Intern)" className={inputClass} />
              {role === "TASKER" && (
                <select
                  {...regForm.register("qualityReviewerId")}
                  className={inputClass}
                >
                  <option value="">Select Quality Reviewer</option>
                  {reviewers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              )}
              <input {...regForm.register("email")} placeholder="you@ethara.ai" className={inputClass} />
              <input type="password" {...regForm.register("password")} placeholder="Password (min 8 chars, upper, lower, number)" className={inputClass} />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
              >
                Create Account <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          {brand.company}
        </p>
      </div>
    </div>
  );
}
