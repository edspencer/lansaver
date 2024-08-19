import DeviceSchema from "./device";

describe("DeviceSchema", () => {
  it("should validate a correct device object", () => {
    const device = {
      type: "hass",
      hostname: "some.host",
      config: "{}",
    };

    expect(() => DeviceSchema.parse(device)).not.toThrow();
  });

  it("should fail validation if type is missing", () => {
    const device = {
      hostname: "Device1",
      config: "{}",
    };

    expect(() => DeviceSchema.parse(device)).toThrow();
  });

  it("should fail validation if hostname is an empty string", () => {
    const device = {
      id: 1,
      name: "",
      scheduleId: 2,
    };

    expect(() => DeviceSchema.parse(device)).toThrow();
  });

  it("should allow lansaver device without a hostname", () => {
    const device = {
      type: "lansaver",
      config: "{}",
    };

    expect(() => DeviceSchema.parse(device)).not.toThrow();
  });

  it("should fail validation if config is missing", () => {
    const device = {
      type: "hass",
      hostname: "some.host",
    };

    expect(() => DeviceSchema.parse(device)).toThrow();
  });

  it("should fail validation if config is not a string", () => {
    const device = {
      type: "hass",
      hostname: "some.host",
      config: 123,
    };

    expect(() => DeviceSchema.parse(device)).toThrow();
  });

  it("should fail validation if an unknown type is presented", () => {
    const device = {
      type: "unknown",
      hostname: "some.host",
      config: "{}",
    };

    expect(() => DeviceSchema.parse(device)).toThrow();
  });
});
