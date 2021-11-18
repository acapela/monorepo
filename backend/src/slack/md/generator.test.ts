import { generateMarkdownFromTipTapJson } from "./generator";
import { parseAndTransformToTipTapJSON } from "./parser";

const advancedMessage = `hello <https://www.google.com/> :rolling_on_the_floor_laughing: test <#C02D6BU8J6P|general>
>  I have a dream
nice some \`code\`
*bold* and _italic_
~llalalalalalal~`;

describe("slack markdown generator", () => {
  it("basic test", async () => {
    expect(generateMarkdownFromTipTapJson(parseAndTransformToTipTapJSON(advancedMessage))).toStrictEqual(
      advancedMessage
    );
  });
  it("advanced test", async () => {
    expect(
      generateMarkdownFromTipTapJson(
        {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "emoji", attrs: { data: { name: "pray", emoji: "🙏" } } },
                { text: " this is a test ", type: "text" },
                {
                  type: "mention",
                  attrs: { data: { type: "request-response", userId: "123-456-789" } },
                },
              ],
            },
            {
              type: "blockquote",
              content: [
                { type: "paragraph", content: [{ text: "blockqoute test", type: "text" }, { type: "hardBreak" }] },
              ],
            },
            { type: "paragraph" },
            {
              type: "paragraph",
              content: [
                { text: "code", type: "text", marks: [{ type: "code" }] },
                { text: " and stuff ", type: "text" },
                { text: "asd", type: "text", marks: [{ type: "strike" }] },
              ],
            },
            {
              type: "bulletList",
              content: [
                { type: "listItem", content: [{ type: "paragraph", content: [{ text: "asd", type: "text" }] }] },
                { type: "listItem", content: [{ type: "paragraph", content: [{ text: "asdasdasd", type: "text" }] }] },
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ text: "asdasdasdasd", type: "text" }] }],
                },
              ],
            },
            { type: "paragraph" },
            {
              type: "orderedList",
              attrs: { start: 1 },
              content: [
                { type: "listItem", content: [{ type: "paragraph", content: [{ text: "asd", type: "text" }] }] },
                { type: "listItem", content: [{ type: "paragraph", content: [{ text: "34123", type: "text" }] }] },
                {
                  type: "listItem",
                  content: [{ type: "paragraph", content: [{ text: "12312312332", type: "text" }] }],
                },
              ],
            },
            { type: "paragraph" },
          ],
        },
        { mentionedSlackIdByUsersId: { "123-456-789": "U123456" } }
      )
    ).toStrictEqual(`:pray: this is a test <@U123456>
> blockqoute test

\`code\` and stuff ~asd~
• asd
• asdasdasd
• asdasdasdasd

1. asd
2. 34123
3. 12312312332
`);
  });
});
