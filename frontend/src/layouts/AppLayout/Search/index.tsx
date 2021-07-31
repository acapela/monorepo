import React, { useRef } from "react";
import styled from "styled-components";
import { theme } from "~ui/theme";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { useBoolean } from "~shared/hooks/useBoolean";
import { PopPresenceAnimator } from "~ui/animations";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { IconSearch } from "~ui/icons";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";
import { TextBody14 } from "~ui/typo";

export const TopBarSearchBar = (): JSX.Element => {
  // All of apple computers use "Mac".
  // https://stackoverflow.com/a/11752084
  const platform = global.window && window.navigator.platform;
  const isMac = platform && platform.toLowerCase().includes("mac");

  const staticSearchBarRef = useRef<HTMLDivElement | null>(null);

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
      <UIHolder ref={staticSearchBarRef} onClick={handleSearchBarModalOpen}>
        <UIPlaceholder>
          <UISearchIcon />
          <TextBody14>Search</TextBody14>
        </UIPlaceholder>
        <ClientSideOnly>
          {isMac && <UIShortcutIndicator>⌘+/</UIShortcutIndicator>}
          {!isMac && <UIShortcutIndicator>ctrl+/</UIShortcutIndicator>}
        </ClientSideOnly>
      </UIHolder>
      {isShowingSearchModal && (
        <ScreenCover isTransparent={true} onCloseRequest={closeModal}>
          <Popover anchorRef={staticSearchBarRef} placement={"bottom-end"} distance={-32}>
            <UISearchContainer>
              <SearchBar />
            </UISearchContainer>
          </Popover>
        </ScreenCover>
      )}
    </>
  );
};

const UIHolder = styled.div`
  padding: 14px;

  height: 32px;
  width: 208px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${theme.colors.actions.tertiary.all()}

  ${theme.borderRadius.circle}

  ${theme.transitions.hover()}
`;

const UIPlaceholder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const UISearchIcon = styled(IconSearch)`
  font-size: 1rem;
  line-height: 1.25rem;
`;

const UIShortcutIndicator = styled.div`
  ${theme.font.body12.build}
`;

const UISearchContainer = styled(PopPresenceAnimator)`
  width: 600px;
  ${theme.borderRadius.input}
  ${theme.shadow.card}
`;
