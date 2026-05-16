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
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Need uppercase")
    .regex(/[a-z]/, "Need lowercase")
    .regex(/[0-9]/, "Need number"),
});

export default function Register() {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      toast("Crew registered — welcome aboard", "success");
      navigate("/dashboard");
    } catch (err) {
      toast(err.response?.data?.error?.message || "Registration failed", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg grid-bg p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Rocket className="mx-auto mb-3 text-cyan" size={32} />
            <h1 className="font-display text-2xl font-bold">Join the Mission</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Have an account?{" "}
            <Link to="/login" className="text-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
