import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { device: string } }): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("success");

  console.log(params);
  console.log(query);

  return new Response("boo", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
