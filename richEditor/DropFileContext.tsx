import { createContext, ReactNode, RefObject, useContext, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { createCleanupObject } from "~shared/cleanup";
import { createElementEvent, createElementEvents } from "~shared/domEvents";

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

export function useFileDroppedInContext(callback?: (files: File[]) => void) {
  const dropFileContext = useDropFileContext();

  useEffect(() => {
    if (!dropFileContext) return;

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
      })
    );

    cleanup.enqueue(
      createElementEvents(dropElement, ["dragenter", "dragover"], (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropElement.classList.add(DROP_INDICATOR_CLASSNAME);
      })
    );

    cleanup.enqueue(
      createElementEvents(dropElement, ["dragleave", "dragend", "drop"], (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropElement.classList.remove(DROP_INDICATOR_CLASSNAME);
      })
    );

    return () => cleanup.clean();
  }, [dropFileContext, callback]);
}

const UIHolder = styled.div`
  &.${DROP_INDICATOR_CLASSNAME} {
    outline: 2px solid #559bf9;
  }
`;
