import { getNotionPreviewText } from "./getNotionPreviewText";

describe("getNotionPreviewText", () => {
  it("should return preview text for valid url", () => {
    const previewText = getNotionPreviewText(
      "https://www.notion.so/acapela/Weekly-Tracker-d80724c3f3f54116ae3d1e278b0724a1"
    );

    expect(previewText).toEqual("Weekly Tracker");
  });
});
