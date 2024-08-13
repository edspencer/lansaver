import { auth } from "@/auth";
// import { SignIn } from "../components/common/signin";
// import SignOut from "@/components/common/signout-button";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-between sm:p-4">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold">LANsaver</h1>
        <p className="text-gray-600">Securely manage and schedule backups for your network devices.</p>
        <div className="md:grid md:grid-cols-3 gap-6 flex flex-col">
          <SystemHealth />
          <RecentBackups />
          <QuickAddDevice />
          <BackupSchedules />
        </div>
      </div>
    </div>
  );
}

import {
  DescriptionList as DL,
  DescriptionTerm as DT,
  DescriptionDetails as DD,
} from "@/components/common/description-list";

import { getDeviceCount } from "@/models/device";
import bytes from "bytes";

async function SystemHealth() {
  const deviceCount = await getDeviceCount();
  const failedBackupsCount = await getFailedBackupsCount();
  const diskUsage = await getBackupsDiskUsage();

  return (
    <DashboardCard heading="System Health" description="">
      <DL>
        <DT>Disk Usage</DT>
        <DD>{diskUsage ? bytes(diskUsage) : "0"}</DD>
        <DT>Devices Protected</DT>
        <DD>{deviceCount}</DD>
        <DT>Recent Failed Backups</DT>
        <DD>{failedBackupsCount}</DD>
      </DL>
    </DashboardCard>
  );
}

import { BackupsTable } from "@/components/backup/table";
import { getBackupsDiskUsage, getFailedBackupsCount, getPaginatedBackups } from "@/models/backup";
async function RecentBackups() {
  const { backups, total } = await getPaginatedBackups({ includeDevice: true, page: 1, perPage: 5 });

  return (
    <DashboardCard heading="Recent Backups" width={2}>
      <div className="flex flex-col gap-4">
        <BackupsTable condensed={true} showDevice={true} backups={backups} />
        <div>
          <Button href="/backups">View All Backups ({total})</Button>
        </div>
      </div>
    </DashboardCard>
  );
}

import { getSchedules } from "@/models/schedule";
import { SchedulesTable } from "@/components/schedule/table";

async function BackupSchedules() {
  const schedules = await getSchedules();

  return (
    <DashboardCard width={2} heading="Backup Schedules" description="Configure the backup schedule for each device.">
      <div className="flex flex-col gap-4">
        <SchedulesTable schedules={schedules} />
        <div>
          <Button href="/schedules/create">Add Schedule</Button>
        </div>
      </div>
    </DashboardCard>
  );
}

import { CreateForm } from "@/components/device/form";
import { Button } from "@/components/common/button";
function QuickAddDevice() {
  return (
    <DashboardCard heading="Add New Device" description="Configure a new device to be backed up">
      <CreateForm />
    </DashboardCard>
  );
}

import { Heading } from "@/components/common/heading";
function DashboardCard({
  children,
  heading,
  description,
  width = 1,
  className,
}: {
  children: React.ReactNode;
  heading?: string;
  description?: string;
  width?: number;
  className?: string;
}) {
  return (
    <div className={`bg-white shadow-md p-4 rounded-lg border border-gray-100 col-span-${width} ${className}`}>
      {heading && (
        <Heading level={2} className="mb-2">
          {heading}
        </Heading>
      )}
      {description && <p className="text-sm mb-8 text-gray-600">{description}</p>}
      {children}
    </div>
  );
}
