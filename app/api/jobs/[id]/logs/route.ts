import { getJobLogs } from "@/lib/runner/logger";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const logs = await getJobLogs(params.id);

  return new Response(logs, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
