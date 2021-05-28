import { Children, forwardRef, RefObject } from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";
import {
  IconAt,
  IconBrackets,
  IconLink1,
  IconListOrdered2,
  IconListUnordered3,
  IconPaperclip,
  IconQuotes,
  IconSend,
  IconTextBold,
  IconTextItalic,
  IconTextStrikethrough,
} from "~ui/icons";
import { EmojiButton } from "./EmojiButton";
import { FileInput } from "./FileInput";
import { ToggleEditorFormatButton } from "./ToggleEditorFormatButton";
import { ToolbarButton } from "./ToolbarButton";

interface Props {
  onFilesSelected?: (files: File[]) => void;
  onSubmit?: () => void;
  quillRef: RefObject<ReactQuill>;
  onEmojiSelected: (emoji: string) => void;
}

export const Toolbar = forwardRef<HTMLDivElement, Props>(function Toolbar(
  { onFilesSelected, onSubmit, onEmojiSelected },
  ref
) {
  return (
    <UIHolder ref={ref}>
      <UISection>
        <ToggleEditorFormatButton tooltipLabel="Bold" formatName="bold" icon={<IconTextBold />} />
        <ToggleEditorFormatButton tooltipLabel="Italic" formatName="italic" icon={<IconTextItalic />} />
        <ToggleEditorFormatButton tooltipLabel="Strikethrough" formatName="strike" icon={<IconTextStrikethrough />} />

        <ToggleEditorFormatButton tooltipLabel="Code Block" formatName="code-block" icon={<IconBrackets />} />
        <ToggleEditorFormatButton tooltipLabel="Create link..." formatName="link" icon={<IconLink1 />} />
        <ToggleEditorFormatButton
          tooltipLabel="Ordered list"
          formatName="list"
          value="ordered"
          icon={<IconListOrdered2 />}
        />
        <ToggleEditorFormatButton
          tooltipLabel="Bullet list"
          formatName="list"
          value="bullet"
          icon={<IconListUnordered3 />}
        />
        <ToggleEditorFormatButton tooltipLabel="Quote" formatName="blockquote" icon={<IconQuotes />} />
      </UISection>

      <UISection>
        <ToolbarButton tooltipLabel="Mention..." onClick={onSubmit} icon={<IconAt />} />
        <EmojiButton onEmojiSelected={onEmojiSelected} />
        <FileInput onFileSelected={(file) => onFilesSelected?.([file])}>
          <ToolbarButton tooltipLabel="Add attachment..." icon={<IconPaperclip />} />
        </FileInput>

        <ToolbarButton tooltipLabel="Submit" onClick={onSubmit} icon={<IconSend />} />
      </UISection>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  &.ql-toolbar {
    color: #788693;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border-top: none;

    &&&:after {
      display: none;
    }

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
  }
`;

const UISection = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(${(props) => Children.toArray(props.children).length}, 1fr);
  min-width: 0;
`;

const UIToolButton = styled.button`
  & {
    svg {
      .ql-fill {
        fill: currentColor;
      }

      .ql-stroke {
        stroke: currentColor;
      }
    }
  }
`;

const UICustomButton = styled.div`
  cursor: pointer;
`;
