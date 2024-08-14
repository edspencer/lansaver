import { z } from "zod";
import { BackupsTable } from "@/components/backup/table";
import { getDeviceBackups, getDeviceByHostname } from "@/models/device";
import { getPaginatedBackups } from "@/models/backup";
import { Spinner } from "@/components/common/spinner";

type BackupsTableToolParameters = {
  condensed?: boolean;
  showDevice?: boolean;
  deviceId?: number;
  deviceName?: string;
  perPage?: number;
  name?: string;
};

const BackupsTableTool = {
  description:
    "Renders a table of backups. Optionally, you can show the device column and condense the table. If the user requests to see all backups, do not pass in a deviceId.",
  parameters: z.object({
    condensed: z
      .boolean()
      .optional()
      .describe("Set to true to condense the table and hide some of the extraneous columns"),
    showDevice: z.boolean().optional().describe("Set to true to show the device column"),
    deviceId: z
      .number()
      .optional()
      .describe("The ID of the device to show backups for (do not set to show all backups)"),
    deviceName: z
      .string()
      .optional()
      .describe(
        "The name of the device to show backups for. Pass this if the user asks for backups for a device by name. The tool will perform a fuzzy search for this device"
      ),
    perPage: z.number().optional().describe("The number of backups to show per page (defaults to 5)"),
    name: z.string().optional().describe("A name to give to this table. For example, 'Recent Backups for Device X'"),
  }),
  generate: async function* (config: BackupsTableToolParameters) {
    const { condensed, showDevice, deviceId, deviceName, perPage = 5, name } = config;

    let backups;

    yield <Spinner />;

    if (deviceName) {
      // Perform a fuzzy search for the device
      const device = await getDeviceByHostname(deviceName);

      if (device) {
        backups = await getDeviceBackups(device.id, { take: perPage });
      }
    } else if (deviceId) {
      backups = await getDeviceBackups(deviceId, { take: perPage });
    }

    if (!backups) {
      backups = (await getPaginatedBackups({ includeDevice: true, page: 1, perPage })).backups;
    }

    return <BackupsTable name={name} backups={backups} condensed={condensed} showDevice={showDevice} />;
  },
};

export default BackupsTableTool;
