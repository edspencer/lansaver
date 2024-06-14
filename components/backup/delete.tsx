"use client";

import { Spinner } from "../common/spinner";
import { Button } from "../common/button";
import { deleteBackupAction } from "../../app/actions/backups";
import { useFormStatus } from "react-dom";
import type { Backup } from "@prisma/client";

import { TrashIcon } from "@heroicons/react/16/solid";

export function DeleteBackupForm({ backup }: { backup: Backup }) {
  return (
    <form action={deleteBackupAction.bind(null, backup.id)}>
      <DeleteBackupButton />
    </form>
  );
}

export function DeleteBackupButton() {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} color="red" type="submit">
      {pending ? (
        <div className="py-1">
          <Spinner />
        </div>
      ) : (
        <TrashIcon />
      )}
    </Button>
  );
}
