import { ReactNode, RefObject, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { createCleanupObject } from "~shared/cleanup";
import { createElementEvent, createElementEvents } from "~shared/domEvents";
import { useBoolean } from "~shared/hooks/useBoolean";

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

const THROTTLE_STOP_DRAG_TIMEOUT_IN_MS = 5000;

export function useFileDroppedInContext(callback?: (files: File[]) => void, options?: FileDropOptions) {
  const dropFileContext = useDropFileContext();

  /* 
    There is weird race condition happening between the start/ongoing drag and stop drag events.

    When the drag leaves a parent element, drag-leave event gets triggered, however the children elements
    immediately fire dragenter event and this even bubbles up the DOM until getting to the parent.

    In a lot of cases, the drag and drop context is placed on a parent element, or an element that has multiple 
    children
    
    Because of this, when we set the "isDragging" state directly in the event handler we will
    have constant blinking of "isDragging" when we drag the file around.

    # Example:
    Imagine we have this DOM tree
    <A>  <--- drag events listened here
      <B>
        <C />
      </B>
    </A>

    1. * Mouse drags over A
    2. Fire 'dragenter' on A
    3. Handle 'dragenter'
    4. * Mouse Drag leaves A , Mouse Drag Enters C
    5. Fire 'dragleave' on A
    6. Fire 'dragenter' on C
    7. Handle 'dragleave'
    8. Bubble 'dragenter' from C to B
    9. Bubble 'dragenter' from B to A
    10. Handle 'dragenter' 
    
    Solution:
    With a "throttled" approach, we prevent these blinks from happening. When we handle a stop dragging event
    we wait 5 seconds before officially set the state as not dragging. If any new "dragenter" or "dragover" event
    happens within those 5 seconds, we will cancel that timer and we won't stop dragging anymore.    
  */
  const [isDragging, { set: setIsDragging, unset: setIsNotDragging }] = useBoolean(false);
  const [delayedDragStopTimerRef, setDelayedDragStopTimerRef] = useState<ReturnType<typeof setTimeout> | null>(null);

  function handleStopDrag() {
    const timeoutRef = setTimeout(() => {
      setIsNotDragging();
    }, THROTTLE_STOP_DRAG_TIMEOUT_IN_MS);
    setDelayedDragStopTimerRef(timeoutRef);
  }

  function handleStartDrag() {
    if (delayedDragStopTimerRef) {
      clearTimeout(delayedDragStopTimerRef);
      setDelayedDragStopTimerRef(null);
    }

    setIsDragging();
  }

  useEffect(() => {
    if (!dropFileContext) return;
    if (options?.isDisabled) return;

    const dropElement = dropFileContext.holderRef.current;

    if (!dropElement) return;

    const cleanup = createCleanupObject();

    cleanup.enqueue(
      createElementEvent(dropElement, "drop", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const filesList = event.dataTransfer?.files;
        if (!filesList) return;

        const filesArray = Array.from(filesList);

        callback?.(filesArray);
        setIsNotDragging();
      })
    );

    cleanup.enqueue(
      createElementEvents(dropElement, ["dragenter", "dragover"], (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleStartDrag();
        dropElement.classList.add(DROP_INDICATOR_CLASSNAME);
      })
    );

    cleanup.enqueue(
      createElementEvents(dropElement, ["dragleave", "dragend", "drop"], (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropElement.classList.remove(DROP_INDICATOR_CLASSNAME);
        handleStopDrag();
      })
    );

    return () => cleanup.clean();
  }, [dropFileContext, callback, options?.isDisabled]);

  return { isDragging } as const;
}

const UIHolder = styled.div<{}>``;
