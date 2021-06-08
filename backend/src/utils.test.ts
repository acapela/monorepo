import { isValidDateString } from "./utils";

describe("Utils", () => {
  it("empty string is not valid date string", async () => {
    const emptyDateString = "";
    expect(isValidDateString(emptyDateString)).toEqual(false);
  });
  it("random string is not a valid date string", async () => {
    const randomString = "This is not a date";
    expect(isValidDateString(randomString)).toEqual(false);
  });
  it("full date with timezone is a valid date string", async () => {
    const longDateString = "Tue Jun 08 2021 00:00:00 GMT+0200 (Central European Summer Time)";
    expect(isValidDateString(longDateString)).toEqual(true);
  });
});
