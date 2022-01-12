import { slugify } from "@aca/shared/slugify";

describe("slugify", () => {
  const testCases = [
    ["hello world", "hello-world"],
    ["Hello World", "hello-world"],
    ["hello     world", "hello-world"],
    ["hello 🌍", "hello"],
    ["🌍", "globe-showing-europe-africa"],
    ["⎃", "U9091"],
    ["⎋", "U9099"],
  ];
  for (const tc of testCases) {
    it(`slugify title ${tc[0]}`, async () => {
      const slug = await slugify(tc[0]);
      expect(slug).toEqual(tc[1]);
    });
  }
});
