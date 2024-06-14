import { Badge } from "../common/badge";

const statusColors: { [key: string]: "blue" | "red" | "green" | "yellow" | undefined } = {
  running: "blue",
  started: "yellow",
  failed: "red",
  completed: "green",
};

export default function StatusBadge({ status }: { status: string }) {
  return <Badge color={statusColors[status]}>{status}</Badge>;
}
