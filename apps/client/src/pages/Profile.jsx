import { useAuth } from "../lib/auth";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card className="text-center">
        <img
          src={user?.avatar}
          alt=""
          className="mx-auto h-24 w-24 rounded-full border-2 border-cyan/30 glow-cyan"
        />
        <h1 className="mt-4 font-display text-2xl font-bold">{user?.name}</h1>
        <p className="text-muted">{user?.email}</p>
        <Badge className="mt-3">{user?.role}</Badge>
        <p className="mt-6 text-sm text-muted">
          Crew member since {new Date(user?.createdAt).toLocaleDateString()}
        </p>
      </Card>
    </div>
  );
}
