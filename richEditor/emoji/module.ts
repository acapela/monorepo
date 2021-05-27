import Quill from "quill";

const Module = Quill.import("core/module");

function getEmojiSearchKeywordFromLineContent(lineContent: string) {
  const regexp = /:([a-z-]+)$/i;
  const match = regexp.exec(lineContent);

  if (!match) return null;

  const [fullMatch, searchKeyword] = match;

  const lineIndex = lineContent.indexOf(fullMatch);

  return {
    searchKeyword,
    lineIndex,
    lineEndIndex: lineIndex + fullMatch.length,
    fullMatch,
  };
}

export interface EmojiModuleOptions {
  onKeywordChange?: (keyword: string | null) => void;
}

export function removeEmojiSearchTextUnderCursor(quill: Quill) {
  const selection = quill.getSelection();

  if (!selection) return;

  const [, selectionInLineIndex] = quill.getLine(selection.index);

  const lineSelectionStartIndex = selection.index - selectionInLineIndex;

  const textInLineBeforeCursor = quill.getText(lineSelectionStartIndex, selectionInLineIndex);

  const emojiSearchKeyword = getEmojiSearchKeywordFromLineContent(textInLineBeforeCursor);

  if (!emojiSearchKeyword) {
    return;
  }

  quill.deleteText(lineSelectionStartIndex + emojiSearchKeyword.lineIndex, emojiSearchKeyword.fullMatch.length);
}

export class EmojiModule extends Module {
  constructor(private quill: Quill, private options: EmojiModuleOptions) {
    super(quill, options);

    quill.on("text-change", this.checkPotentialEmojiSearchUpdate);
    quill.on("selection-change", this.checkPotentialEmojiSearchUpdate);
  }

  private checkPotentialEmojiSearchUpdate = () => {
    const { quill } = this;
    const selection = quill.getSelection();

    if (!selection) {
      return;
    }

    const [, selectionInLineIndex] = quill.getLine(selection.index);

    const lineSelectionStartIndex = selection.index - selectionInLineIndex;

    const textInLineBeforeCursor = quill.getText(lineSelectionStartIndex, selectionInLineIndex);

    const emojiSearchKeyword = getEmojiSearchKeywordFromLineContent(textInLineBeforeCursor);

    if (!emojiSearchKeyword) {
      this.options.onKeywordChange?.(null);
      return;
    }

    this.options.onKeywordChange?.(emojiSearchKeyword.searchKeyword);
  };
}

export const EMOJI_MODULE_NAME = `acapela-emoji`;

export function registerEmojiModule() {
  Quill.register(
    {
      [`modules/${EMOJI_MODULE_NAME}`]: EmojiModule,
    },
    true
  );
}
