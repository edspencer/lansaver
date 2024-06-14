import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/common/pagination";

import { Button } from "@/components/common/button";

const defaultPerPage = 10;

export default function PaginationBar({
  className,
  page = 1,
  totalPages = 1,
  perPage = defaultPerPage,
}: {
  className?: string;
  page?: number;
  totalPages?: number;
  perPage?: number;
}) {
  return (
    <div className={`${className} flex gap-4`}>
      <Pagination className="flex-1">
        <PaginationPrevious href={page === 1 ? undefined : paginationHref(page - 1, perPage)} />
        <PaginationList>
          <PaginationLinks perPage={perPage} page={page} totalPages={totalPages} />
        </PaginationList>
        <PaginationNext href={page === totalPages ? undefined : paginationHref(page + 1, perPage)} />
      </Pagination>
      <PageSizeButtonGroup perPage={perPage} />
    </div>
  );
}

function PageSizeButtonGroup({ perPage = defaultPerPage }) {
  return (
    <div className="flex border rounded-lg">
      <PageSizeButton perPage={10} current={perPage === 10} />
      <PageSizeButton perPage={20} current={perPage === 20} />
      <PageSizeButton perPage={50} current={perPage === 50} />
    </div>
  );
}

function PageSizeButton({ perPage, current }: { perPage: number; current: boolean }) {
  return (
    <Button href={paginationHref(1, perPage)} plain className={current ? "bg-gray-200 text-white" : ""}>
      {perPage}
    </Button>
  );
}

const paginationHref = (page: number, perPage: number) => {
  if (perPage === defaultPerPage) {
    return `?page=${page}`;
  } else {
    return `?page=${page}&perPage=${perPage}`;
  }
};

//renders a window of pagination links
function PaginationLinks({ perPage = defaultPerPage, page = 1, totalPages = 1 }) {
  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pageNumbers = allPages.length < 8 ? allPages : generatePageNumbers({ page, totalPages });

  const gapAfterFirst = pageNumbers[0] > 2;
  const gapBeforeLast = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  return (
    <>
      {pageNumbers[0] > 1 && <PaginationPage href="?page=1">1</PaginationPage>}
      {gapAfterFirst && <PaginationGap />}
      {pageNumbers.map((p) => (
        <PaginationPage key={p} href={paginationHref(p, perPage)} current={p === Number(page)}>
          {p}
        </PaginationPage>
      ))}
      {gapBeforeLast && <PaginationGap />}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <PaginationPage href={paginationHref(totalPages, perPage)} current={page === totalPages}>
          {totalPages}
        </PaginationPage>
      )}
    </>
  );
}

/**
 * Generates page numbers for pagination. Useful if we have lots of pages and don't want to
 * render all of them.
 * @param page Current page
 * @param totalPages Total number of pages
 * @param maxPages Maximum number of pages to show
 * @returns Array of page numbers
 * @example
 * generatePageNumbers({ page: 3, totalPages: 10, maxPages: 6 });
 * // [1, 2, 3, 4, 5, 6]
 * generatePageNumbers({ page: 8, totalPages: 10, maxPages: 6 });
 * // [5, 6, 7, 8, 9, 10]
 */
function generatePageNumbers({ page = 1, totalPages = 1, maxPages = 6 }) {
  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxPages / 2);
  const start = Math.max(page - half, 1);
  const end = Math.min(start + maxPages, totalPages);

  return Array.from({ length: end - start }, (_, i) => start + i);
}
