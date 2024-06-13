import { createMachine } from "xstate";

export enum JobState {
  Pending = "pending",
  Started = "started",
  Completed = "completed",
  Failed = "failed",
}

export const jobMachine = createMachine({
  id: "job",
  initial: JobState.Pending,
  states: {
    [JobState.Pending]: {
      on: {
        START: JobState.Started,
        FAIL: JobState.Failed,
      },
    },
    [JobState.Started]: {
      on: {
        COMPLETE: JobState.Completed,
        FAIL: JobState.Failed,
      },
    },
    [JobState.Completed]: {
      type: "final",
    },
    [JobState.Failed]: {
      type: "final",
    },
  },
});
