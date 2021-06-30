import { ChainedCommands } from "@tiptap/react";
import { Children, forwardRef } from "react";
import styled from "styled-components";
import { BACKGROUND_ACCENT } from "~ui/colors";
import {
  IconAt,
  IconBrackets,
  IconListOrdered2,
  IconListUnordered3,
  IconPaperclip,
  IconQuotes,
  IconSend,
  IconTextBold,
  IconTextItalic,
  IconTextStrikethrough,
} from "~ui/icons";
import { useRichEditorContext, useRichEditorIsEmpty } from "./context";
import { EmojiButton } from "./EmojiButton";
import { FileInput } from "./FileInput";
import { ToolbarButton } from "./ToolbarButton";

interface Props {
  onFilesSelected?: (files: File[]) => void;
  onSubmit?: () => void;
  onEmojiSelected: (emoji: string) => void;
  submitMode?: RichEditorSubmitMode;
}

export type RichEditorSubmitMode = "hide" | "disable" | "enable";

export const Toolbar = forwardRef<HTMLDivElement, Props>(function Toolbar(
  { onFilesSelected, onSubmit, onEmojiSelected, submitMode },
  ref
) {
  const editor = useRichEditorContext();

  function getIsFormatActive(formatName: string, formatOptions?: Record<string, unknown>) {
    return editor.isActive(formatName, formatOptions);
  }

  function createFormatHandler<N extends keyof ChainedCommands>(name: N, ...args: Parameters<ChainedCommands[N]>) {
    return function run() {
      let command = editor.chain().focus();

      command = Reflect.apply(command[name], null, args);

      command.run();
    };
  }

  return (
    <UIHolder ref={ref}>
      <UISection>
        <ToolbarButton
          onClick={createFormatHandler("toggleBold")}
          tooltipLabel="Bold"
          isHighlighted={getIsFormatActive("bold")}
          icon={<IconTextBold />}
        />
        <ToolbarButton
          tooltipLabel="Italic"
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
          isHighlighted={getIsFormatActive("italic")}
          icon={<IconTextItalic />}
        />
        <ToolbarButton
          tooltipLabel="Strikethrough"
          isHighlighted={getIsFormatActive("strike")}
          onClick={createFormatHandler("toggleStrike")}
          icon={<IconTextStrikethrough />}
        />
        <ToolbarButton
          onClick={createFormatHandler("toggleCodeBlock")}
          tooltipLabel="Code Block"
          isHighlighted={getIsFormatActive("code-block")}
          icon={<IconBrackets />}
        />
        {/* TODO now we 'only' have autolinks. Integrate nice UI to create links with modal */}
        {/* <ToolbarButton tooltipLabel="Create link..." isHighlighted={getIsFormatActive("link")} icon={<IconLink1 />} /> */}
        <ToolbarButton
          tooltipLabel="Ordered list"
          isHighlighted={getIsFormatActive("orderedList")}
          onClick={createFormatHandler("toggleOrderedList")}
          icon={<IconListOrdered2 />}
        />
        <ToolbarButton
          tooltipLabel="Bullet list"
          isHighlighted={getIsFormatActive("bulletList")}
          onClick={createFormatHandler("toggleBulletList")}
          icon={<IconListUnordered3 />}
        />
        <ToolbarButton
          onClick={createFormatHandler("toggleBlockquote")}
          tooltipLabel="Quote"
          isHighlighted={getIsFormatActive("blockquote")}
          icon={<IconQuotes />}
        />
      </UISection>

      <UISection>
        <ToolbarButton tooltipLabel="Mention..." onClick={onSubmit} icon={<IconAt />} />
        <EmojiButton onEmojiSelected={onEmojiSelected} />
        <FileInput onFileSelected={(file) => onFilesSelected?.([file])}>
          <ToolbarButton tooltipLabel="Add attachment..." icon={<IconPaperclip />} />
        </FileInput>

        {/* Only show submit button if onSubmit callback is provided */}
        {submitMode !== "hide" && !!onSubmit && (
          <ToolbarButton
            isDisabled={submitMode === "disable"}
            isHighlighted={submitMode === "enable"}
            tooltipLabel="Submit"
            onClick={onSubmit}
            icon={<IconSend />}
          />
        )}
      </UISection>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${BACKGROUND_ACCENT};

  ${() => UISection} {
    ${() => UIToolButton} {
      all: unset;
      background: none;
      border: none;
      cursor: pointer;
      display: inline-block;

      font-size: 1.25rem;
      height: 1em;
      padding: 0.25em;
      width: 1em;
    }
  }
`;

const UISection = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(${(props) => Children.toArray(props.children).length}, 1fr);
  min-width: 0;
`;

const UIToolButton = styled.button``;
