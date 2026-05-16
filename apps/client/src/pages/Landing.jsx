import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, FlaskConical, Shield, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { brand } from "../config/brand";

const features = [
  { icon: Brain, title: "Model Registry", desc: "Track LLMs, embeddings, and agents from research to production." },
  { icon: FlaskConical, title: "AI Lab", desc: "Run experiments, evals, and fine-tuning with full traceability." },
  { icon: Shield, title: "Enterprise RBAC", desc: "Admin & member roles with secure JWT sessions." },
  { icon: BarChart3, title: "Ops Telemetry", desc: "Latency, accuracy, and squad velocity in one dashboard." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg grid-bg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan" size={24} />
          <span className="font-display text-xl font-bold">{brand.name}</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button>Launch Console</Button>
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan">{brand.tagline}</p>
          <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
            Ship AI products
            <span className="block bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
              with mission-grade control
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{brand.description}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Open {brand.shortName} Console <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {features.map((f) => (
            <div key={f.title} className="glass glow-cyan-hover rounded-xl p-6 text-left">
              <f.icon className="mb-4 text-cyan" size={28} />
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
