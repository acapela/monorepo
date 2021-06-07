// https://github.com/SmallImprovements/quill-auto-links
// This file is mostly copied from quill-auto-links with slight adjustments.
// It had multiple typing issues so I disabled eslint

/* eslint-disable */
import Quill, { RangeStatic } from "quill";

const DEFAULT_OPTIONS = {
  paste: true,
  type: true,
};

type Options = Partial<typeof DEFAULT_OPTIONS>;

const REGEXP_GLOBAL = /https?:\/\/[^\s]+/g;
const REGEXP_WITH_PRECEDING_WS = /(?:\s|^)(https?:\/\/[^\s]+)/;

const sliceFromLastWhitespace = (str: string) => {
  const whitespaceI = str.lastIndexOf(" ");
  const sliceI = whitespaceI === -1 ? 0 : whitespaceI + 1;
  return str.slice(sliceI);
};
function registerTypeListener(quill: Quill) {
  // @ts-ignore
  quill.keyboard.addBinding({
    collapsed: true,
    key: " ",
    prefix: REGEXP_WITH_PRECEDING_WS,
    handler: (range: RangeStatic, context: any) => {
      const url = sliceFromLastWhitespace(context.prefix);
      const retain = range.index - url.length;
      const ops: any[] = retain ? [{ retain }] : [];
      ops.push({ delete: url.length }, { insert: url, attributes: { link: url } });

      // @ts-ignore
      quill.updateContents({ ops });
      return true;
    },
  });
}

function registerPasteListener(quill: Quill) {
  quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
    if (typeof node.data !== "string") {
      return delta;
    }
    const matches = node.data.match(REGEXP_GLOBAL);
    if (matches && matches.length > 0) {
      const ops = [];
      let str = node.data;
      matches.forEach((match: any) => {
        const split = str.split(match);
        const beforeLink = split.shift();
        ops.push({ insert: beforeLink });
        ops.push({ insert: match, attributes: { link: match } });
        str = split.join(match);
      });
      ops.push({ insert: str });
      delta.ops = ops;
    }

    return delta;
  });
}

export class AutoLinks {
  constructor(quill: Quill, options: Options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    if (opts.type) {
      registerTypeListener(quill);
    }
    if (opts.paste) {
      registerPasteListener(quill);
    }
  }
}

export const AUTOLINK_MODULE_NAME = "autolink";

export function registerAutolinksModule() {
  Quill.register(
    {
      [`modules/${AUTOLINK_MODULE_NAME}`]: AutoLinks,
    },
    true
  );
}
