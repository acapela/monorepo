import { cleanupAst, parseSlackMarkdown } from "~shared/slackMarkdown/parser";

describe("slack markdown", () => {
  it("basic test", async () => {
    //     const res = await parseSlackMarkdown(`
    // :rofl: <https://google.com|google>
    // > hello
    // text?
    // \`inline code\`
    // \`\`\`
    // block code
    // \`\`\`
    // <!here|heeeeerre>
    // hello <@U01D8D6Q2DT>
    // `);
    const message = `:information_source: <@U01D8D6Q2DT>, I <https://www.notion.so/acapela/Ladder-creative-strategy-review-30-09-21-9a2bd4daef7c4a3b8429f834e99a5ed4|typed up the notes> from our meeting with Ladder. Kyle gave some feedback on the one-pager, which I thought was actually very useful. <@U01MQGMUJKG>, feel free to add anything you think I missed.`;
    const parsed = parseSlackMarkdown(message);
    expect(parsed).toStrictEqual([
      { content: "information_source", type: "emoji" },
      { content: " ", type: "text" },
      { content: "", id: "U01D8D6Q2DT", type: "slackUser" },
      { content: ", I ", type: "text" },
      {
        content: [{ content: "typed up the notes", type: "text" }],
        target:
          "https://www.notion.so/acapela/Ladder-creative-strategy-review-30-09-21-9a2bd4daef7c4a3b8429f834e99a5ed4",
        type: "autolink",
      },
      {
        content:
          " from our meeting with Ladder. Kyle gave some feedback on the one-pager, which I thought was actually very useful. ",
        type: "text",
      },
      { content: "", id: "U01MQGMUJKG", type: "slackUser" },
      { content: ", feel free to add anything you think I missed.", type: "text" },
      { type: "newline" },
    ]);
  });
});

describe("cleanup", () => {
  it("merge text nodes", async () => {
    expect(
      cleanupAst([
        { content: "A", type: "text" },
        { content: "information_source", type: "emoji" },
        { content: "B", type: "text" },
        { content: "C", type: "text" },
        { content: "D", type: "text" },
        { content: "E", type: "text" },
        { content: "F", type: "text" },
        { content: "information_source", type: "emoji" },
      ])
    ).toStrictEqual([
      { content: "A", type: "text" },
      { content: "information_source", type: "emoji" },
      { content: "BCDEF", type: "text" },
      { content: "information_source", type: "emoji" },
    ]);
  });

  it("nested merge text nodes", async () => {
    expect(
      cleanupAst([
        { content: "A", type: "text" },
        { content: "information_source", type: "emoji" },
        {
          content: [
            { content: "B", type: "text" },
            { content: "C", type: "text" },
            { content: "D", type: "text" },
          ],
          type: "blockQuote",
        },
        { content: "information_source", type: "emoji" },
      ])
    ).toStrictEqual([
      { content: "A", type: "text" },
      { content: "information_source", type: "emoji" },
      { content: [{ content: "BCD", type: "text" }], type: "blockQuote" },
      { content: "information_source", type: "emoji" },
    ]);
  });
});
