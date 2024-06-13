import { createMachine } from "xstate";

export enum BackupState {
  Pending = "pending",
  Started = "started",
  Completed = "completed",
  Failed = "failed",
}

export const backupMachine = createMachine({
  id: "backup",
  initial: BackupState.Pending,
  states: {
    [BackupState.Pending]: {
      on: {
        START: BackupState.Started,
        FAIL: BackupState.Failed,
      },
    },
    [BackupState.Started]: {
      on: {
        COMPLETE: BackupState.Completed,
        FAIL: BackupState.Failed,
      },
    },
    [BackupState.Completed]: {
      type: "final",
    },
    [BackupState.Failed]: {
      type: "final",
    },
  },
});
