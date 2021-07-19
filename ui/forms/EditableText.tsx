import { useEffect, useRef } from "react";
import { useClickAway, useIsomorphicLayoutEffect } from "react-use";
import styled, { css } from "styled-components";
import { createDocumentEvent, useElementEvent } from "~shared/domEvents";
import { useDoubleClick } from "~shared/hooks/useDoubleClick";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface Props {
  isInEditMode: boolean;
  value: string;
  onValueSubmit: (newValue: string) => void;
  onEditModeChangeRequest: (isInEditMode: boolean) => void;
  allowDoubleClickEditRequest?: boolean;
  focusSelectMode?: FocusSelectMode;
}

type FocusSelectMode = "cursor-at-end" | "select";

export function EditableText({
  isInEditMode,
  value,
  onValueSubmit,
  onEditModeChangeRequest,
  allowDoubleClickEditRequest = true,
  focusSelectMode = "cursor-at-end",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function focusEditable() {
    if (!ref.current) return;
    ref.current?.focus();
    setSelectionToElement(ref.current, focusSelectMode);
  }

  useEffect(() => {
    if (!isInEditMode || !ref.current) return;

    focusEditable();

    /**
     * If other elements are trying to focus while we're in edit mode - prevent them from doing so, but
     * as soon as we finish edition, instantly give focus back to them.
     */

    let otherElementTryingToFocusWhileInEditMode: HTMLElement | null;

    const cleanupWatchingOtherElementsFocus = createDocumentEvent(
      "focus",
      (event) => {
        if (!ref.current) return;
        // If it's another focus on this editable text itself, do nothing
        if (event.target === ref.current) return;

        // Capture element trying to focus and ensure it is not gaining the focus.
        otherElementTryingToFocusWhileInEditMode = event.target as HTMLElement;

        event.preventDefault();
        event.stopPropagation();

        focusEditable();
      },
      { capture: true }
    );

    return () => {
      cleanupWatchingOtherElementsFocus();
      // If we exit edit mode and other element was trying to focus, give focus back to it.
      if (otherElementTryingToFocusWhileInEditMode) {
        otherElementTryingToFocusWhileInEditMode?.focus?.();
      }
    };
  }, [isInEditMode]);

  useDoubleClick(
    ref,
    () => {
      onEditModeChangeRequest(true);
    },
    { isEnabled: allowDoubleClickEditRequest }
  );

  useElementEvent(
    ref,
    "click",
    (event) => {
      event.stopPropagation();
    },
    { isEnabled: isInEditMode, capture: true }
  );

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerText = value;
  }, [value]);

  function handleSubmit() {
    if (!ref.current) return;
    const currentValue = ref.current.innerText;
    onEditModeChangeRequest(false);

    if (currentValue === value) return true;

    onValueSubmit(currentValue);

    return true;
  }

  useClickAway(ref, () => {
    if (!isInEditMode) return;
    handleSubmit();
  });

  useShortcut("Enter", handleSubmit, { isEnabled: isInEditMode });
  useShortcut(
    "Esc",
    () => {
      if (!ref.current) return;
      ref.current.innerText = value;
      onEditModeChangeRequest(false);
    },
    { isEnabled: isInEditMode }
  );

  return <UIHolder isInEditMode={isInEditMode} ref={ref} contentEditable={isInEditMode}></UIHolder>;
}

const UIHolder = styled.span<{ isInEditMode: boolean }>`
  /* 
    We need display block to properly capture click events in edit mode.

    Imagine such multi line content in edit mode

    foo foo foo foo
    foo

    Now imagine you want to move cursor to the end by clicking in 'x' point

    foo foo foo foo
    foo      x

    If it'd have display: inline. Click in 'x' point would actually be outside of this span and cause exit of edit mode
    which is super annoying.
   */
  display: block;
  ${(props) => {
    if (props.isInEditMode) {
      return css`
        outline: none;
        cursor: text;
      `;
    }

    return css`
      user-select: none;
    `;
  }}
`;

function setSelectionToElement(element: HTMLElement, mode: FocusSelectMode) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(element, mode === "cursor-at-end" ? 1 : 0);
  range.setEnd(element, 1);

  selection?.removeAllRanges();
  selection?.addRange(range);
}
