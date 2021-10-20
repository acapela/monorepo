import { getFigmaPreviewText } from "./getFigmaPreviewText";

describe("getFigmaPreviewText", () => {
  it("should return preview text for valid url", () => {
    const previewText = getFigmaPreviewText(
      "https://www.figma.com/file/JtUxmZiS1RfZgREOmjKjKD/Final-flows?node-id=26%3A3303"
    );

    expect(previewText).toEqual("Final flows");
  });
});
