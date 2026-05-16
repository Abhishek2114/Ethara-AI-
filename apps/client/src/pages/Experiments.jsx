import { useEffect, useState } from "react";
import { FlaskConical, Plus } from "lucide-react";
import { experimentsApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { PageSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";
import { brand } from "../config/brand";

const STATUS_VARIANT = {
  RUNNING: "default",
  COMPLETED: "success",
  FAILED: "danger",
  PLANNED: "muted",
  ARCHIVED: "muted",
};

export default function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    experimentsApi
      .list()
      .then((res) => setExperiments(res.data.data.experiments))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await experimentsApi.update(id, { status });
      toast(`Experiment marked ${status}`, "success");
      const res = await experimentsApi.list();
      setExperiments(res.data.data.experiments);
    } catch {
      toast("Update failed", "error");
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">AI Lab</h1>
        <p className="text-muted">{brand.name} research experiments & eval runs</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {experiments.map((exp) => (
          <Card key={exp.id} hover>
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <FlaskConical className="shrink-0 text-purple" size={22} />
                <div>
                  <h3 className="font-semibold">{exp.name}</h3>
                  <p className="mt-1 text-sm text-muted">{exp.hypothesis}</p>
                  {exp.model && (
                    <p className="mt-2 text-xs text-cyan">
                      Model: {exp.model.name} v{exp.model.version}
                    </p>
                  )}
                  {exp.project && (
                    <p className="text-xs text-muted">Project: {exp.project.title}</p>
                  )}
                </div>
              </div>
              <Badge variant={STATUS_VARIANT[exp.status] || "default"}>{exp.status}</Badge>
            </div>
            {exp.status === "PLANNED" && (
              <Button size="sm" className="mt-4" onClick={() => updateStatus(exp.id, "RUNNING")}>
                Start run
              </Button>
            )}
            {exp.status === "RUNNING" && (
              <Button size="sm" variant="secondary" className="mt-4" onClick={() => updateStatus(exp.id, "COMPLETED")}>
                Mark complete
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
