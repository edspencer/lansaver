import { z } from "zod";

const pages = ["/", "/schedules", "/devices", "/schedules/:id", "/devices/:id", "/backups"];

const RedirectTool = {
  description:
    "Redirects the user's browser to a different page. Here are the set of pages you can redirect the user to (in each case a token like :id means you should substitute that part for a parameter - for example `/schedules/:id` would become `/schedules/123` to show Schedule with id=123): " +
    pages.join(", "),
  parameters: z.object({
    url: z.string().describe("The URL to redirect to"),
  }),
  generate: ({ url }: { url: string }) => {
    console.log("RedirectTool", url);

    return {
      type: "redirect",
      url,
    };
  },
};

export default RedirectTool;
