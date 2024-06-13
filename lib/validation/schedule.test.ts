import ScheduleSchema from "./schedule";

describe("ScheduleSchema", () => {
  const validCron = "0 0 * * *";
  const invalidCron = "0 0 * *";

  it("should validate a correct schedule object", () => {
    const schedule = {
      name: "My Schedule",
      cron: validCron,
    };

    expect(() => ScheduleSchema.parse(schedule)).not.toThrow();
  });

  it("should fail validation if name is missing", () => {
    const schedule = {
      cron: validCron,
    };

    expect(() => ScheduleSchema.parse(schedule)).toThrow();
  });

  it("should fail validation if cron is missing", () => {
    const schedule = {
      name: "My Schedule",
    };

    expect(() => ScheduleSchema.parse(schedule)).toThrow();
  });

  it("should fail validation if cron is invalid", () => {
    const schedule = {
      name: "My Schedule",
      cron: invalidCron,
    };

    expect(() => ScheduleSchema.parse(schedule)).toThrow();
  });
});
