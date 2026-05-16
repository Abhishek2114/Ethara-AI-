import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { useAuth } from "../lib/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useToast } from "../hooks/useToast";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast("Welcome back, commander", "success");
      navigate("/dashboard");
    } catch (err) {
      toast(err.response?.data?.error?.message || "Login failed", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg grid-bg p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="w-full max-w-md shadow-[0_20px_60px_rgba(0,229,255,0.1)]">
          <div className="mb-8 text-center">
            <Rocket className="mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] text-cyan" size={40} />
            <h1 className="font-display text-3xl font-bold text-cyan">Mission Login</h1>
            <p className="mt-2 text-sm text-text/70">Access Ethara AI command center</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
            <Button type="submit" size="lg" className="w-full mt-2" loading={isSubmitting}>
              Sign In
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted/90">
            New crew?{" "}
            <Link to="/register" className="font-medium text-cyan hover:text-cyan/80 hover:underline transition">
              Register
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-muted/60">
            Demo: admin@ethara.ai / Admin123!
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
