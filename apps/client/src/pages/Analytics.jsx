import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { dashboardApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { PageSkeleton } from "../components/ui/Skeleton";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .stats()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;
  if (!data) return null;

  const radarData = data.teamProductivity.map((m) => ({
    name: m.user.name.split(" ")[0],
    productivity: m.rate,
    tasks: m.total,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="text-muted">Team performance telemetry</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display font-semibold">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.charts.byPriority}>
              <XAxis dataKey="priority" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ background: "#161D2E", border: "1px solid rgba(0,229,255,0.2)" }} />
              <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="mb-4 font-display font-semibold">Crew Productivity Radar</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(0,229,255,0.15)" />
              <PolarAngleAxis dataKey="name" stroke="#94A3B8" />
              <Radar dataKey="productivity" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <h2 className="mb-4 font-display font-semibold">Deadline Heatmap</h2>
        <div className="grid grid-cols-7 gap-2">
          {data.upcomingDeadlines.map((t, i) => (
            <div
              key={t.id}
              className="rounded-lg p-2 text-center text-xs"
              style={{
                background:
                  t.daysLeft < 0
                    ? "rgba(239,68,68,0.2)"
                    : t.daysLeft <= 2
                      ? "rgba(245,158,11,0.2)"
                      : "rgba(0,229,255,0.1)",
              }}
              title={t.title}
            >
              <p className="font-medium truncate">{t.title.slice(0, 12)}</p>
              <p className="text-muted">{t.daysLeft}d</p>
            </div>
          ))}
          {data.upcomingDeadlines.length === 0 && (
            <p className="col-span-7 text-center text-muted py-8">No deadlines in range</p>
          )}
        </div>
      </Card>
    </div>
  );
}
