import { AnimatePresence } from "framer-motion";
import React, { RefObject } from "react";
import styled, { css } from "styled-components";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { useBoolean } from "~shared/hooks/useBoolean";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { PopPresenceAnimator } from "~ui/animations";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { IconSearch } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

interface Props {
  defaultWidth: number;
  availableSpace: number;
}

export const TopBarSearchBar = namedForwardRef<HTMLDivElement, Props>(function TopBarSearchBar(
  { defaultWidth, availableSpace }: Props,
  staticSearchBarRef
) {
  // All of apple computers use "Mac".
  // https://stackoverflow.com/a/11752084
  const platform = global.window && window.navigator.platform;
  const isMac = platform && platform.toLowerCase().includes("mac");

  const [isShowingSearchModal, { set: openModal, unset: closeModal }] = useBoolean(false);

  useShortcut(["Mod", "/"], handleSearchBarModalOpen);
  useShortcut("Escape", () => closeModal(), { isEnabled: isShowingSearchModal });

  function handleSearchBarModalOpen(event: KeyboardEvent | React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    openModal();
  }

  return (
    <>
      <UIHolder
        defaultWidth={defaultWidth}
        availableSpace={availableSpace}
        ref={staticSearchBarRef}
        onClick={handleSearchBarModalOpen}
      >
        <UIPlaceholder>
          <UISearchIcon />
          <UITextPlaceholder>Search</UITextPlaceholder>
        </UIPlaceholder>
        <ClientSideOnly>
          {isMac && <UIShortcutIndicator>⌘+/</UIShortcutIndicator>}
          {!isMac && <UIShortcutIndicator>ctrl+/</UIShortcutIndicator>}
        </ClientSideOnly>
      </UIHolder>
      <AnimatePresence>
        {isShowingSearchModal && (
          <ScreenCover isTransparent={true} onCloseRequest={closeModal}>
            <Popover anchorRef={staticSearchBarRef as RefObject<HTMLElement>} placement={"bottom-end"} distance={-32}>
              <UISearchContainer>
                <SearchBar />
              </UISearchContainer>
            </Popover>
          </ScreenCover>
        )}
      </AnimatePresence>
    </>
  );
});

const UITextPlaceholder = styled.div<{}>`
  ${theme.font.body14.build}
  color: ${theme.colors.layout.supportingText()}
`;

const UIShortcutIndicator = styled.div<{}>`
  ${theme.font.body14.build}
`;

const UIHolder = styled.div<{ defaultWidth: number; availableSpace: number }>`
  padding: 14px;

  height: 32px;
  width: ${({ defaultWidth }) => defaultWidth}px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${({ availableSpace, defaultWidth }) => {
    if (availableSpace >= defaultWidth) {
      return;
    }

    if (availableSpace < 100) {
      return css`
        padding: 8px;
        width: 32px;

        ${UITextPlaceholder} {
          display: none;
        }

        ${UIShortcutIndicator} {
          display: none;
        }
      `;
    }

    if (availableSpace < 150) {
      return css`
        ${UIShortcutIndicator} {
          display: none;
        }
      `;
    }
  }}

  ${theme.colors.actions.tertiary.all()}

  ${theme.borderRadius.circle}

  ${theme.transitions.hover()}
`;

const UIPlaceholder = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const UISearchIcon = styled(IconSearch)<{}>`
  font-size: 1rem;
  line-height: 1.25;
`;

const UISearchContainer = styled(PopPresenceAnimator)<{}>`
  width: 600px;
  ${theme.borderRadius.input}
  ${theme.shadow.card}
`;
