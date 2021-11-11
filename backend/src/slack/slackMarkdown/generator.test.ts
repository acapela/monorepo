import { generateMarkdownFromTipTapJson } from "~backend/src/slack/slackMarkdown/generator";
import { parseAndTransformToTipTapJSON } from "~backend/src/slack/slackMarkdown/parser";

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
});
