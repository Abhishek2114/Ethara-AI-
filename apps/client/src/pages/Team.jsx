import { useEffect, useState } from "react";
import { teamApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { PageSkeleton } from "../components/ui/Skeleton";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamApi
      .list()
      .then((res) => setTeam(res.data.data.team))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Crew Roster</h1>
        <p className="text-muted">Team members across all missions</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card key={member.id} hover>
            <div className="flex items-center gap-4">
              <img src={member.avatar} alt="" className="h-14 w-14 rounded-full border-2 border-cyan/20" />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted">{member.email}</p>
                <Badge className="mt-2">{member.role}</Badge>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted">
              {member._count?.tasks || 0} tasks · {member._count?.memberships || 0} projects
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
