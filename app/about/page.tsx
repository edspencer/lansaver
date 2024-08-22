import { Heading } from "@/components/common/heading";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <Heading level={1}>About</Heading>
      <p>
        LANsaver is a tool that helps users back up the configurations of network devices such as routers, firewalls,
        switches and Home Assistant instances. It has the following features:
      </p>
      <ul className="list-disc list-inside">
        <li>CRUD operations for Devices - user can specify the hostname, type and credentials for the device</li>
        <li>
          Backup operations - user can back up the configuration of a Device. The Backup is stored as a file, and has
          logs that the user can view
        </li>
        <li>
          Schedule operations - user CRUD Schedules, which apply to a subset of devices and run on a cron schedule
        </li>
        <li>
          Job operations - user can see the status of a job, and see the logs of a job. A Job is a collection of Backup
          operations, and is associated with a Schedule.
        </li>
      </ul>
    </div>
  );
}
