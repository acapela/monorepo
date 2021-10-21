import { JSONContent } from "@tiptap/core";
import { observer } from "mobx-react";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import { useDb } from "~frontend/clientdb";
import { AutocompleteNodeProps } from "~richEditor/autocomplete/component";
import { MENTION_TYPE_KEY } from "~shared/editor/mentions";
import { useBoolean } from "~shared/hooks/useBoolean";
import { EditorMentionData } from "~shared/types/editor";
import { MENTION_TYPE_LABELS, MentionType } from "~shared/types/mention";
import { PopPresenceAnimator } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

import { MentionTypePicker } from "./MentionTypePicker";

function updateContentMentionTypesForUser(node: JSONContent, userId: string, type: MentionType): JSONContent {
  let attrs = node.attrs;
  if (node.type === MENTION_TYPE_KEY) {
    const { data } = node.attrs as { data: EditorMentionData };
    if (data.userId == userId) {
      attrs = { data: { userId, type } };
    }
  }

  const content = node.content
    ? node.content.map((childNode) => updateContentMentionTypesForUser(childNode, userId, type))
    : undefined;

  return { ...node, attrs, content };
}

export const TypedMention = observer((props: PropsWithChildren<AutocompleteNodeProps<EditorMentionData>>) => {
  const { editor, isEditable, data } = props;
  const db = useDb();
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const [isMentionPickerOpen, { set: openMentionTypePicker, unset: closeMentionTypePicker }] = useBoolean(false);
  useEffect(() => {
    if (!isMentionPickerOpen) return;

    editor.on("update", closeMentionTypePicker);

    return () => {
      editor.off("update", closeMentionTypePicker);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMentionPickerOpen]);

  useShortcut("Escape", closeMentionTypePicker);

  function handleOpenMentionTypePicker() {
    if (isEditable) {
      openMentionTypePicker();
    }
  }

  return (
    <>
      {isMentionPickerOpen && (
        <Popover
          anchorRef={anchorRef}
          placement="top-start"
          onClickOutside={closeMentionTypePicker}
          isDisabled={!isEditable}
        >
          <PopPresenceAnimator>
            <MentionTypePicker
              selected={data.type}
              onSelect={(mentionType: MentionType) => {
                editor.commands.setContent(
                  updateContentMentionTypesForUser(editor.getJSON() as never, data.userId, mentionType)
                );
                closeMentionTypePicker();
              }}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
      <UIMention
        ref={anchorRef}
        type={data.type}
        onClick={handleOpenMentionTypePicker}
        data-tooltip={MENTION_TYPE_LABELS[data.type] + (isEditable ? " (click to change)" : "")}
        isEditable={isEditable}
      >
        @{db.user.findById(data.userId)?.name ?? "???"}
      </UIMention>
    </>
  );
});

function getMentionFontColor(mentionType: MentionType) {
  switch (mentionType) {
    case "request-action":
      return theme.colors.tags.action.asColor;
    case "request-response":
      return theme.colors.tags.feedback.asColor;
    case "request-read":
      return theme.colors.tags.read.asColor;
    case "observer":
      return theme.colors.tags.observe.asColor;
    default:
      return theme.colors.tags.primary.asColor;
  }
}

const UIMention = styled.span<{ isEditable: boolean; type: MentionType }>`
  cursor: default;

  ${theme.font.bold}

  ${(props) =>
    css`
      ${getMentionFontColor(props.type)}
    `}

  ${(props) =>
    props.isEditable &&
    css`
      cursor: pointer;
    `}

  svg {
    color: inherit;
  }
`;
