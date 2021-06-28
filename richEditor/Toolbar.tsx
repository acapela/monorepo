import { Children, forwardRef } from "react";
import styled from "styled-components";
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
  hideSubmitButton?: boolean;
}

export const Toolbar = forwardRef<HTMLDivElement, Props>(function Toolbar(
  { onFilesSelected, onSubmit, onEmojiSelected, hideSubmitButton },
  ref
) {
  const isEmpty = useRichEditorIsEmpty();
  const editor = useRichEditorContext();

  function getIsFormatActive(formatName: string, formatOptions?: Record<string, unknown>) {
    return editor.isActive(formatName, formatOptions);
  }

  return (
    <UIHolder ref={ref}>
      <UISection>
        <ToolbarButton
          onClick={() => {
            editor.chain().focus().toggleBold().run();
            // alert("oki");
          }}
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
          onClick={() => {
            editor.chain().focus().toggleStrike().run();
          }}
          icon={<IconTextStrikethrough />}
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          tooltipLabel="Code Block"
          isHighlighted={getIsFormatActive("code-block")}
          icon={<IconBrackets />}
        />
        {/* TODO now we 'only' have autolinks. Integrate nice UI to create links with modal */}
        {/* <ToolbarButton tooltipLabel="Create link..." isHighlighted={getIsFormatActive("link")} icon={<IconLink1 />} /> */}
        <ToolbarButton
          tooltipLabel="Ordered list"
          isHighlighted={getIsFormatActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<IconListOrdered2 />}
        />
        <ToolbarButton
          tooltipLabel="Bullet list"
          isHighlighted={getIsFormatActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<IconListUnordered3 />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
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
        {!hideSubmitButton && !!onSubmit && (
          <ToolbarButton
            isDisabled={isEmpty}
            isHighlighted={!isEmpty}
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
  color: #788693;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ccc;

  ${() => UISection} {
    ${() => UIToolButton} {
      all: unset;
      background: none;
      border: none;
      cursor: pointer;
      display: inline-block;

      font-size: 20px;
      height: 1em;
      padding: 0.25em;
      width: 1em;
    }

    ${() => UICustomButton} {
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

const UICustomButton = styled.div`
  cursor: pointer;
`;
