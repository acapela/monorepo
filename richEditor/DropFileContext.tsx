import { ReactNode, RefObject, createContext, useContext, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import { createCleanupObject } from "~shared/cleanup";
import { createElementEvent, createElementEvents } from "~shared/domEvents";
import { useThrottledState } from "~shared/hooks/useDebouncedState";

interface DropFileContextData {
  holderRef: RefObject<HTMLDivElement>;
}

const reactDropFileContext = createContext<DropFileContextData | null>(null);

interface DropFileContextProps {
  children: ReactNode;
  className?: string;
}

export function DropFileContext({ children, className }: DropFileContextProps) {
  const holderRef = useRef<HTMLDivElement>(null);

  const dropFileContextValue = useMemo<DropFileContextData>(() => {
    return { holderRef };
  }, [holderRef]);

  return (
    <reactDropFileContext.Provider value={dropFileContextValue}>
      <UIHolder className={className} ref={holderRef}>
        {children}
      </UIHolder>
    </reactDropFileContext.Provider>
  );
}

export function useDropFileContext() {
  return useContext(reactDropFileContext);
}

const DROP_INDICATOR_CLASSNAME = "drop-active";

interface FileDropOptions {
  isDisabled?: boolean;
}

export function useFileDroppedInContext(callback?: (files: File[]) => void, options?: FileDropOptions) {
  const dropFileContext = useDropFileContext();

  /* 
    When dragging inside nested elements, there are bunch of 'drag enter' and 'drag leave' events fired as 'drag' is switching
    from one element inside to another.

    To avoid flickering of this state and way too many re-renders, we throttle state changes of 'isDragging'
  */
  const [isDragging, setIsDragging] = useThrottledState(false, 50);

  // Indicate visually if is dragging or not
  useEffect(() => {
    const dropElement = dropFileContext?.holderRef.current;
    if (!dropElement) {
      return;
    }
    if (isDragging) {
      dropElement.classList.add(DROP_INDICATOR_CLASSNAME);
      return;
    }

    dropElement.classList.remove(DROP_INDICATOR_CLASSNAME);
  }, [isDragging]);

  useEffect(() => {
    if (!dropFileContext) return;
    if (options?.isDisabled) return;

    const dropElement = dropFileContext.holderRef.current;

    if (!dropElement) return;

    const cleanup = createCleanupObject();

    cleanup.enqueue(
      createElementEvent(
        dropElement,
        "drop",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          setIsDragging(false);

          const filesList = event.dataTransfer?.files;
          if (!filesList) return;

          const filesArray = Array.from(filesList);

          callback?.(filesArray);
        },
        { capture: true }
      )
    );

    cleanup.enqueue(
      createElementEvents(
        dropElement,
        ["dragenter", "dragover"],
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          setIsDragging(true);
        },
        { capture: true }
      )
    );

    cleanup.enqueue(
      createElementEvents(
        dropElement,
        ["dragleave", "dragend", "drop"],
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          setIsDragging(false);
        },
        { capture: true }
      )
    );

    return () => cleanup.clean();
  }, [dropFileContext, callback, options?.isDisabled]);

  return { isDragging } as const;
}

const UIHolder = styled.div<{}>`
  transition: 0.15s opacity;
  &.${DROP_INDICATOR_CLASSNAME} {
    opacity: 0.6;
  }
`;
