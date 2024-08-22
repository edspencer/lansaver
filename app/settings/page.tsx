import { Heading, Subheading } from "@/components/common/heading";
import { exportDatabase } from "@/lib/import-export";

import { JsonView } from "@/components/settings/JsonView";
import { InformAI } from "inform-ai";
import { SettingsUploadForm } from "@/components/settings/Form";

import packageConfig from "../../package.json";

const prompt = `This page is a settings page for the lansaver application. 
It exports the current application configuration, which includes information 
about the schedules, devices, and other settings. The exported configuration 
can be used to restore the application to its current state at a later time.`;

export default async function SettingsPage() {
  const config = await exportDatabase();

  const { version } = packageConfig;

  return (
    <div className="flex flex-col gap-10">
      <InformAI name="Settings" prompt={prompt} props={{ config }} />
      <Heading level={1}>
        Settings <span className="text-sm">(LANsaver version {version})</span>
      </Heading>

      <div className="flex flex-col gap-4">
        <Subheading level={2}>Export Config</Subheading>
        <JsonView src={config} />
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <Subheading level={2}>Import Config</Subheading>
        <p>
          Upload a JSON file matching the schema of the exported file.{" "}
          <span className="text-red-600">All existing data will be deleted!</span>
        </p>
        <SettingsUploadForm />
      </div>
    </div>
  );
}
