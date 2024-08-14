import { z } from "zod";
import { Redirect } from "@/components/redirect";

//list of all of the pages that the LLM can redirect the user to
const pages = [
  "/",
  "/schedules",
  "/schedules/create",
  "/schedules/:id",
  "/schedules/:id/edit",
  "/devices",
  "/devices/create",
  "/devices/:id",
  "/devices/:id/edit",
  "/backups",
];

const RedirectTool = {
  description:
    "Redirects the user's browser to a different page. Here are the set of pages you can redirect the user to (in each case a token like :id means you should substitute that part for a parameter - for example `/schedules/:id` would become `/schedules/123` to show Schedule with id=123): " +
    pages.join(", "),
  parameters: z.object({
    url: z.string().describe("The URL to redirect to"),
    message: z.string().optional().describe("A message to show to the user before redirecting"),
  }),
  generate: function ({ url, message }: { url: string; message?: string }) {
    return <Redirect url={url} message={message} />;
  },
};

export default RedirectTool;
