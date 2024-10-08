import { BackupsTable } from "@/components/backup/table";
import { Heading } from "@/components/common/heading";
import { getPaginatedBackups } from "@/models/backup";
import PaginationBar from "@/components/pagination-bar";
import NoContentYet from "@/components/no-content-yet";

export const revalidate = 0;

export default async function BackupsPage({ searchParams: { page = 1, perPage = 10 } }) {
  const { backups, total, totalPages } = await getPaginatedBackups({ includeDevice: true, page, perPage });

  return (
    <>
      <Heading className="mb-8">All Backups ({total})</Heading>
      <NoContentYet items={backups} message="No backups yet" />
      {totalPages > 0 ? <BackupsTable backups={backups} showDevice={true} /> : null}
      {backups.length === 0 ? null : (
        <PaginationBar className="mt-6" perPage={Number(perPage)} page={Number(page)} totalPages={totalPages} />
      )}
    </>
  );
}
