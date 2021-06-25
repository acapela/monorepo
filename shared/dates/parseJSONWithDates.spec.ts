import { parseJsonWithDatesOnlyForValidKeys, parseJsonWithDates } from "./parseJSONWithDates";
import { parseISO } from "date-fns";

describe("parseJsonWithDates", () => {
  it("properly parses dates in object", () => {
    const input = {
      foo: new Date(),
      bar: [new Date()],
    };

    const json = JSON.stringify(input);

    expect(parseJsonWithDates(json)).toEqual(input);
  });

  const shouldNotParse = [1624544210021, "1624544210021", "2020-01-01", "1-1"];

  shouldNotParse.forEach((shouldNotParseInput) => {
    it(`will not parse date like, bot non ISO dates (${JSON.stringify(shouldNotParseInput)})`, () => {
      const testJSON = {
        value: shouldNotParseInput,
      };

      const json = JSON.stringify(testJSON);

      const parsed = parseJsonWithDates<{ value: unknown }>(json);

      expect(typeof shouldNotParseInput).toEqual(typeof parsed.value);
    });
  });

  it("should parse ISO string", () => {
    const testDate = new Date(2020, 0, 0, 0, 0, 0, 0);
    const isoString = "2019-12-30T23:00:00.000Z";

    expect(parseJsonWithDates<Date>(JSON.stringify(isoString))).toEqual(testDate);
  });

  it("should parse only specific date fields", () => {
    const input = {
      title: "2019-12-30T23:00:00.000Z",
      created_at: "2019-12-30T23:00:00.000Z",
    };

    expect(parseJsonWithDatesOnlyForValidKeys(JSON.stringify(input))).toEqual({
      title: input.title,
      created_at: parseISO(input.created_at),
    });
  });
});
