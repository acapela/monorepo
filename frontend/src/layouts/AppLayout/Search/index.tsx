import React, { RefObject } from "react";
import styled from "styled-components";
import { hoverTransition } from "~ui/transitions";
import { TextBody14 } from "~ui/typo";
import { BASE_GREY_1, BASE_GREY_2, BASE_GREY_7, BASE_GREY_4 } from "~ui/colors";
import { IconSearch } from "~ui/icons";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { borderRadius, shadow } from "~ui/baseStyles";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { useBoolean } from "~shared/hooks/useBoolean";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { Popover } from "~ui/popovers/Popover";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { POP_PRESENCE_STYLES } from "~ui/animations";

interface Props {
  anchorRef: RefObject<HTMLElement>;
}

export const TopBarSearchBar = ({ anchorRef }: Props): JSX.Element => {
  // All of apple computers use "Mac".
  // https://stackoverflow.com/a/11752084
  const platform = global.window && window.navigator.platform;
  const isMac = platform && platform.toLowerCase().includes("mac");

  useShortcut(["Mod", "/"], handleSearchBarModalOpen);
  useShortcut("Escape", () => closeModal());

  const [isShowingSearchModal, { set: openModal, unset: closeModal }] = useBoolean(false);

  function handleSearchBarModalOpen(event: KeyboardEvent | React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    openModal();
  }

  return (
    <>
      <UIHolder isInvisible={isShowingSearchModal} onClick={handleSearchBarModalOpen}>
        <UIPlaceholder>
          <UISearchIcon />
          <TextBody14>Search</TextBody14>
        </UIPlaceholder>
        <ClientSideOnly>
          {isMac && <UIShortcutIndicator>⌘/</UIShortcutIndicator>}
          {!isMac && <UIShortcutIndicator>control+/</UIShortcutIndicator>}
        </ClientSideOnly>
      </UIHolder>
      {isShowingSearchModal && (
        <ScreenCover isTransparent={true} onCloseRequest={closeModal}>
          <Popover anchorRef={anchorRef} placement={"bottom"} distance={-42}>
            <UISearchContainer presenceStyles={POP_PRESENCE_STYLES}>
              <SearchBar />
            </UISearchContainer>
          </Popover>
        </ScreenCover>
      )}
    </>
  );
};

const UIHolder = styled.div<{ isInvisible: boolean }>`
  padding: 14px;

  height: 32px;
  width: 208px;
  max-width: 208px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  color: ${BASE_GREY_4};
  background: ${BASE_GREY_7};

  border-radius: 64px;

  &:hover {
    background: ${BASE_GREY_4};
    color: ${BASE_GREY_2};
  }

  ${hoverTransition()}

  opacity: ${(props) => (props.isInvisible ? 0 : 1)};
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
  color: ${BASE_GREY_1};
`;

const UIShortcutIndicator = styled(TextBody14)`
  color: ${BASE_GREY_1};
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const UISearchContainer = styled(PresenceAnimator)`
  width: 600px;
  ${borderRadius.input}
  ${shadow.card}
`;
