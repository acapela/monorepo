import { getLoomEmbedUrl } from "./getLoomEmbedUrl";

describe("getLoomEmbedUrl", () => {
  it("should return embed url for valid shared url", () => {
    const embedUrl = getLoomEmbedUrl("https://www.loom.com/share/5bbdeb480ba84e65b1b3de8c190e2003");

    expect(embedUrl).toEqual("https://www.loom.com/embed/5bbdeb480ba84e65b1b3de8c190e2003");
  });

  it("should return null for invalid shared url", () => {
    const embedUrl = getLoomEmbedUrl("https://www.loom.com/5bbdeb480ba84e65b1b3de8c190e2003");

    expect(embedUrl).toEqual(null);
  });
});
