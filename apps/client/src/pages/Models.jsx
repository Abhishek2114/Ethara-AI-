import { useEffect, useState } from "react";
import { Brain, Plus, Zap } from "lucide-react";
import { modelsApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { PageSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";
import { brand } from "../config/brand";

const STATUS_VARIANT = {
  PRODUCTION: "success",
  STAGING: "warning",
  DEVELOPMENT: "default",
  DEPRECATED: "muted",
};

export default function Models() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", version: "", type: "LLM", description: "" });
  const { toast } = useToast();

  const load = () =>
    modelsApi
      .list()
      .then((res) => setModels(res.data.data.models))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await modelsApi.create(form);
      toast("Model registered", "success");
      setShowForm(false);
      setForm({ name: "", version: "", type: "LLM", description: "" });
      load();
    } catch {
      toast("Failed to register model", "error");
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Model Registry</h1>
          <p className="text-muted">{brand.name} production & research models</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Register Model
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={create} className="grid gap-3 md:grid-cols-2">
            <input className="rounded-lg border border-cyan/10 bg-surface px-3 py-2" placeholder="Model name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="rounded-lg border border-cyan/10 bg-surface px-3 py-2" placeholder="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} required />
            <select className="rounded-lg border border-cyan/10 bg-surface px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {["LLM", "EMBEDDING", "VISION", "AGENT", "OTHER"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input className="rounded-lg border border-cyan/10 bg-surface px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button type="submit">Register</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {models.map((m) => (
          <Card key={m.id} hover>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Brain className="text-cyan" size={20} />
                <div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-xs text-muted">v{m.version}</p>
                </div>
              </div>
              <Badge variant={STATUS_VARIANT[m.status] || "default"}>{m.status}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted line-clamp-2">{m.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
              <span className="text-purple">{m.type}</span>
              {m.accuracy != null && <span>{Math.round(m.accuracy * 100)}% acc</span>}
              {m.latencyMs != null && <span className="flex items-center gap-1"><Zap size={12} />{m.latencyMs}ms</span>}
              <span>{m._count?.experiments || 0} experiments</span>
            </div>
            {m.endpoint && (
              <p className="mt-2 truncate font-mono text-[10px] text-cyan/70">{m.endpoint}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
