class Converter {
  constructor(private srcAlphabet: string, private dstAlphabet: string) {}

  convert(number: string) {
    let i: number,
      divide: number,
      newlen: number,
      length = number.length,
      result = "";
    const numberMap: Record<number, number> = {},
      fromBase = this.srcAlphabet.length,
      toBase = this.dstAlphabet.length;

    if (this.srcAlphabet === this.dstAlphabet) {
      return number;
    }

    for (i = 0; i < length; i++) {
      numberMap[i] = this.srcAlphabet.indexOf(number[i]);
    }
    do {
      divide = 0;
      newlen = 0;
      for (i = 0; i < length; i++) {
        divide = divide * fromBase + numberMap[i];
        if (divide >= toBase) {
          numberMap[newlen++] = parseInt((divide / toBase) as unknown as string, 10);
          divide = divide % toBase;
        } else if (newlen > 0) {
          numberMap[newlen++] = 0;
        }
      }
      length = newlen;
      result = this.dstAlphabet[divide] + result;
    } while (newlen != 0);

    return result;
  }
}

/**
 * Function get source and destination alphabet and return convert function
 *
 * @param {string} srcAlphabet
 * @param {string} dstAlphabet
 *
 * @returns {function(number)}
 */
export function anyBase(srcAlphabet: string, dstAlphabet: string) {
  const converter = new Converter(srcAlphabet, dstAlphabet);
  const reverseConverter = new Converter(dstAlphabet, srcAlphabet);
  /**
   * Convert function
   *
   * @param {string} number
   *
   * @return {string} number
   */
  function convert(number: string) {
    return converter.convert(number);
  }

  function revert(number: string) {
    return reverseConverter.convert(number);
  }

  return {
    convert,
    revert,
  };
}

export const commonBase = {
  BIN: "01",
  OCT: "01234567",
  DEC: "0123456789",
  HEX: "0123456789abcdef",
  ALPHA: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
};
