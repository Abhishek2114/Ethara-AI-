import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Database, Activity, Star } from "lucide-react";
import { brand } from "../config/brand";
import AuthLogo from "../components/ui/AuthLogo";

const features = [
  { 
    icon: Cpu, 
    title: "AI Workforce Seeding", 
    desc: "Coordinate human talent and LLM tasks seamlessly with role-based JWT access.",
    tag: "High Throughput"
  },
  { 
    icon: Database, 
    title: "Compliance Auditing", 
    desc: "Automatically track work hour logs, daily check-in times, and session activities.",
    tag: "SOC 2 Audit Ready"
  },
  { 
    icon: Activity, 
    title: "Real-time Telemetry", 
    desc: "Analyze individual tasker status, attendance logs, and project velocity live.",
    tag: "Instant Insights"
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden select-none">
      
      {/* Premium Backdrops */}
      <div className="glow-backdrop-cyan" />
      <div className="glow-backdrop-purple" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(0,229,255,0.02)_0%,transparent_60%)] pointer-events-none" />

      {/* Grid Overlay background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 border-b border-border bg-bg/20 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <AuthLogo size="sm" />
          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="text-xs font-bold text-muted hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-bg hover:brightness-110 active:scale-98 transition-all"
            >
              Launch Console <ArrowRight size={13} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-16 md:pt-24 pb-20 text-center space-y-10">
        
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4.5 py-1 text-xs font-bold text-primary tracking-wide">
          <Sparkles size={13} /> Introducing AstralHQ Operations Control Suite
        </div>

        {/* Huge Value Proposition Header */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-center">
            Mission Control for
            <span className="block text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.2)] mt-2">
              Modern Hybrid Teams
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-text-secondary leading-relaxed pt-2">
            The definitive workspace orchestration platform. Track member attendance, allocate cross-functional resources, review quality scores, and maintain perfect audit compliance.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-bg hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-primary/20"
          >
            Launch AstralHQ Dashboard <ArrowRight size={16} />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-xl border border-border bg-card hover:bg-card/80 py-3.5 px-6 text-sm font-bold text-white transition-all hover:border-border-strong active:scale-98"
          >
            Access Demo Portal
          </Link>
        </div>

        {/* High-Fidelity Mockup Platform Control Center */}
        <div className="relative pt-12 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-surface-elevated/40 p-1.5 shadow-2xl glass-card overflow-hidden">
            {/* Window chrome header */}
            <div className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-2 text-[10px] text-muted">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
              </div>
              <span className="font-mono text-muted/60">astralhq.com/ops-portal</span>
              <div className="w-8" />
            </div>

            {/* Dashboard Mock Graphics */}
            <div className="bg-[#070B14] p-6 text-left space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Workspace Throughput</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">99.4%</span>
                    <span className="text-[10px] text-success font-semibold">+1.2% this week</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Active Taskers Online</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">24 / 28</span>
                    <span className="text-[10px] text-primary font-semibold">Live Session</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Compliance Audits</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">Verified</span>
                    <span className="text-[10px] text-success font-semibold">SOC 2 compliant</span>
                  </div>
                </div>
              </div>

              {/* Layout Content mock */}
              <div className="border border-border rounded-xl bg-card/60 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold text-primary tracking-widest">Active Workspace Mission</span>
                  <p className="text-sm font-semibold text-white">Ethara AI Operations Terminal v2.0</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-12 rounded bg-primary/20 animate-pulse" />
                  <div className="h-2 w-16 rounded bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Up Feature Grid */}
        <section className="grid gap-6 sm:grid-cols-3 pt-12 text-left">
          {features.map((f, idx) => (
            <div 
              key={idx} 
              className="rounded-2xl border border-border bg-card/60 hover:bg-card p-6 transition-all hover:border-primary/20 space-y-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <f.icon size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest">
                  {f.tag}
                </span>
                <h3 className="font-display text-base font-bold text-white">{f.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Testimonial Panel */}
        <section className="rounded-2xl border border-border bg-card/20 p-8 text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}
          </div>
          <p className="text-sm italic text-text-secondary leading-relaxed">
            "AstralHQ completely changed how we coordinate our operations. We went from chaotic spreadsheets to a beautiful, mission-grade control center that audits our time entries, leaves, and analytics flawlessly."
          </p>
          <div className="text-xs font-bold uppercase tracking-wider text-white">
            Lead Administrator — Ethara Engineering
          </div>
        </section>

        {/* Footer Brand Compliance */}
        <footer className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <div>
            &copy; {new Date().getFullYear()} {brand.company}. All rights reserved.
          </div>
          <div className="flex items-center gap-6 font-bold uppercase">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-primary" /> SOC 2 Certified
            </span>
            <span>GDPR Compliant</span>
            <span>HIPAA Compliant</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
