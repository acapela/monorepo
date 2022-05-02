import fs from "fs";
import path from "path";

const record1JSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record1.json"), "utf8");
const record2JSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record1.json"), "utf8");

const record1 = JSON.parse(record1JSON);
const record2 = JSON.parse(record2JSON);

describe("notion worker extraction tests", () => {
  it("fails", () => {
    console.info(record1);
    console.info(record2);
    expect(true).toBe(false);
  });
});
