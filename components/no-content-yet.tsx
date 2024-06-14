import Link from "next/link";

export default function NoContentYet({ items = [], href, message }: { items: any[]; href?: string; message: string }) {
  if (items.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-48 text-gray-500">
      {message} &nbsp;
      {href ? (
        <Link className="text-blue-600 underline" href={href}>
          Create one now
        </Link>
      ) : null}
    </div>
  );
}
