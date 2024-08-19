// registry.ts
import OPNSenseBackupRunner from "./devices/opnsense";
import HomeAssistantRunner from "./devices/hass";
import TPLinkRunner from "./devices/tplink";
import LANsaverRunner from "./devices/lansaver";
import { BackupRunner } from "./factory";

const runnerRegistry: { [key: string]: BackupRunner } = {
  opnsense: new OPNSenseBackupRunner(),
  hass: new HomeAssistantRunner(),
  tplink: new TPLinkRunner(),
  lansaver: new LANsaverRunner(),
};

export default runnerRegistry;
