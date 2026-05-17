import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, Eye, EyeOff, ShieldCheck, CheckCircle, Sparkles } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { authApi } from "../../lib/api";
import { brand, ROLES, ROLE_LABELS } from "../../config/brand";
import { useToast } from "../../hooks/useToast";
import AuthLogo from "../../components/ui/AuthLogo";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
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

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const regForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "TASKER", email: "", password: "", name: "", jobTitle: "" },
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

  // Auto-fill demo credentials
  const handleTryDemo = () => {
    loginForm.setValue("email", "abhishek.singh23@ethara.ai");
    loginForm.setValue("password", "Admin123!");
    toast("Demo credentials filled!", "success");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg select-none">
      
      {/* Left Marketing Side - SaaS Standard Split Screen */}
      <div className="relative hidden lg:flex w-7/12 flex-col justify-between p-12 bg-gradient-to-br from-bg via-card/30 to-bg border-r border-border overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 -mt-24 -ml-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-24 -mr-24 h-96 w-96 rounded-full bg-purple/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="z-10">
          <AuthLogo size="md" />
        </div>

        {/* Content Showcase */}
        <div className="z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles size={12} />
            Version 2.0 Enterprise Release
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            Mission Control for AI Operations
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            Monitor, orchestrate, and audit your workforce performance, system resources, and attendance metrics from a single dark-luxury dashboard.
          </p>

          {/* Interactive Feature Cards */}
          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 shadow-lg">
              <CheckCircle className="text-primary shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-sm font-semibold text-white">Hybrid Workforce Co-Pilot</h4>
                <p className="text-xs text-text-secondary">Sync tasks, projects, and employee assignments smoothly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 shadow-lg">
              <ShieldCheck className="text-primary shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-sm font-semibold text-white">Compliance Standard Seeding</h4>
                <p className="text-xs text-text-secondary">Secure auditing, real-time check-ins, and auto-generated daily reports.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges bottom row */}
        <div className="z-10 border-t border-border/80 pt-6 flex items-center justify-between">
          <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
            Operational Excellence
          </span>
          <div className="flex items-center gap-4 text-xs font-bold text-muted">
            <span>SOC 2 COMPLIANT</span>
            <span>GDPR CERTIFIED</span>
          </div>
        </div>
      </div>

      {/* Right Form Side - Clean compact form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 md:p-12 bg-bg relative">
        {/* Mobile top logo header */}
        <div className="lg:hidden absolute top-6 left-6">
          <AuthLogo size="sm" />
        </div>

        <div className="w-full max-w-[400px] space-y-6">
          {/* Header Title */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white font-display">
              {mode === "login" ? "Sign in to AstralHQ" : "Create your account"}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Enter your credentials to access the control panel.
            </p>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toast("SSO integrations are managed by your enterprise administrator.", "info")}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-card/80 py-2.5 px-4 text-sm font-semibold text-white transition-all hover:border-border-strong active:scale-98"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg> GitHub
            </button>
            <button
              onClick={() => toast("SSO integrations are managed by your enterprise administrator.", "info")}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-card/80 py-2.5 px-4 text-sm font-semibold text-white transition-all hover:border-border-strong active:scale-98"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg> Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80" />
            </div>
            <span className="relative bg-bg px-3 text-xs uppercase font-bold text-muted tracking-widest">
              or continue with email
            </span>
          </div>

          {/* Real Segmented tab controls */}
          <div className="p-1 rounded-xl bg-surface border border-border flex gap-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-primary text-bg shadow-lg"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "register"
                  ? "bg-primary text-bg shadow-lg"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Try Demo autofill option in Login Mode */}
          {mode === "login" && (
            <button
              type="button"
              onClick={handleTryDemo}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 py-3 px-4 text-xs font-bold text-primary transition-all active:scale-98"
            >
              <Sparkles size={14} /> Try Premium Demo Account
            </button>
          )}

          {/* Role selection in Registration mode */}
          {mode === "register" && (
            <div className="space-y-2">
              <span className="block text-xs uppercase font-bold tracking-widest text-muted">Select Role</span>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(ROLES)
                  .filter((r) => r !== "ADMIN")
                  .map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                        role === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted hover:border-border-strong"
                      }`}
                    >
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Form blocks */}
          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-muted">Email</span>
                <input
                  {...loginForm.register("email")}
                  placeholder="you@ethara.ai"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-[11px] text-danger">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="block text-xs uppercase font-bold tracking-widest text-muted">Password</span>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); toast("Password reset is self-managed in locally hosted databases.", "info"); }}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    {...loginForm.register("password")}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-10 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                  <button type="button" className="absolute right-3 top-3 text-muted" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-[11px] text-danger">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-text-secondary select-none cursor-pointer">
                <input type="checkbox" className="accent-primary" defaultChecked /> Remember my session on this device
              </label>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3.5 px-4 text-sm font-bold text-bg hover:brightness-110 active:scale-98 transition-all"
              >
                <LogIn size={16} /> Sign In to Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={regForm.handleSubmit(onRegister)} className="space-y-3">
              <div className="space-y-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-muted">Full Name</span>
                <input
                  {...regForm.register("name")}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary"
                />
                {regForm.formState.errors.name && (
                  <p className="text-[11px] text-danger">{regForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-muted">Job Title</span>
                <input
                  {...regForm.register("jobTitle")}
                  placeholder="e.g. Operations Coordinator"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {role === "TASKER" && (
                <div className="space-y-1">
                  <span className="block text-xs uppercase font-bold tracking-widest text-muted">Quality Reviewer</span>
                  <select
                    {...regForm.register("qualityReviewerId")}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary"
                  >
                    <option value="">Select Reviewer</option>
                    {reviewers.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-muted">Email</span>
                <input
                  {...regForm.register("email")}
                  placeholder="you@ethara.ai"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary"
                />
                {regForm.formState.errors.email && (
                  <p className="text-[11px] text-danger">{regForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="block text-xs uppercase font-bold tracking-widest text-muted">Password</span>
                <input
                  type="password"
                  {...regForm.register("password")}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary"
                />
                {regForm.formState.errors.password && (
                  <p className="text-[11px] text-danger">{regForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3.5 px-4 text-sm font-bold text-bg hover:brightness-110 active:scale-98 transition-all mt-4"
              >
                <UserPlus size={16} /> Create Account →
              </button>
            </form>
          )}

          {/* Trust Strip */}
          <div className="pt-6 border-t border-border flex items-center justify-center gap-6 text-[10px] uppercase font-bold text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-primary" /> SOC 2 Audited
            </span>
            <span>GDPR COMPLIANT</span>
            <span>256-BIT AES</span>
          </div>
        </div>
      </div>
    </div>
  );
}
