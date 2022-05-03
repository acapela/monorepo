import fs from "fs";
import path from "path";

import { extractNotifications } from "./notificationExtractor";

describe("notion worker extraction tests", () => {
  // it("extracts as many notifications as in record map", () => {
  //   const recordJSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record.json"), "utf8");
  //   const record = JSON.parse(recordJSON);
  //   const record1Notifications = extractNotifications(record);
  //   expect(record1Notifications).toHaveLength(record.notificationIds.length);
  // });

  it("extracts the right one", () => {
    const recordUserMentionedJSON = fs.readFileSync(path.resolve(__dirname + "/testFixtures/record2.json"), "utf8");
    const recordUserMentioned = JSON.parse(recordUserMentionedJSON);
    const result = extractNotifications(recordUserMentioned);

    expect(result).toHaveLength(3);
  });
});
