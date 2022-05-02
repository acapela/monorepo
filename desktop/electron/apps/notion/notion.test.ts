import fs from "fs";
import path from "path";

import { extractNotifications } from "./notificationExtractor";

// const recordJSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record.json"), "utf8");
const recordUserMentionedJSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record2.json"), "utf8");

// const record = JSON.parse(recordJSON);
const recordUserMentioned = JSON.parse(recordUserMentionedJSON);

describe("notion worker extraction tests", () => {
  // it("extracts as many notifications as in record map", () => {
  //   const record1Notifications = extractNotifications(record);

  //   expect(record1Notifications).toHaveLength(record.notificationIds.length);
  // });

  it("extracts the right one", () => {
    const result = extractNotifications(recordUserMentioned);

    expect(result).toHaveLength(3);
  });
});
