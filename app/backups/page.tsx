import BackupsTable from "@/components/backup/table";
import { Heading } from "@/components/common/heading";
import { getPaginatedBackups } from "@/models/backup";
import PaginationBar from "@/components/pagination-bar";

export default async function BackupsPage({ searchParams: { page = 1, perPage = 10 } }) {
  const { backups, total, totalPages } = await getPaginatedBackups({ includeDevice: true, page, perPage });

  return (
    <>
      <Heading className="mb-8">All Backups ({total})</Heading>
      <BackupsTable backups={backups} showDevice={true} />
      <PaginationBar className="mt-6" perPage={Number(perPage)} page={Number(page)} totalPages={totalPages} />
    </>
  );
}
