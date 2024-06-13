import BackupSchema from "./backup";

describe("BackupSchema", () => {
  it("should validate a correct backup object", () => {
    const backup = {
      status: "pending",
      device: {
        connect: {
          id: 1,
        },
      },
    };

    expect(() => BackupSchema.parse(backup)).not.toThrow();
  });

  it("should fail validation if status is missing", () => {
    const backup = {
      device: {
        connect: {
          id: 1,
        },
      },
    };

    expect(() => BackupSchema.parse(backup)).toThrow();
  });

  it("should fail validation if device is missing", () => {
    const backup = {
      status: "pending",
    };

    expect(() => BackupSchema.parse(backup)).toThrow();
  });

  it("should fail validation if an unknown status is presented", () => {
    const backup = {
      status: "unknown",
      device: {
        connect: {
          id: 1,
        },
      },
    };

    expect(() => BackupSchema.parse(backup)).toThrow();
  });
});
