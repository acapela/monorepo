import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { IconChevronDown } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { UIPopoverMenuModal } from "~ui/popovers/PopoverMenu";
import { useIsRoutePathActive } from "~frontend/routes";
import { hoverActionActiveCss, hoverActionCss } from "~ui/transitions";

export interface NavItemInfo {
  key: string;
  title: string;
  href: string;
  icon?: ReactNode;
  childItems?: NavItemInfo[];
  disableNavigation?: boolean;
}

interface Props {
  item: NavItemInfo;
  className?: string;
}

export const NavItem = styled(({ item, className }: Props) => {
  const isActive = useIsRoutePathActive(item.href);
  const holderRef = useRef<HTMLAnchorElement>(null);

  const [isHovered, { set: setHovered, unset: unsetHovered }] = useBoolean(false);

  const shouldShowChildItems = useDebouncedValue(isHovered, { onDelay: 0, offDelay: 150 });

  const { childItems } = item;

  return (
    <>
      <Link href={item.href} passHref>
        <UIHolder
          ref={holderRef}
          className={className}
          isActive={isActive}
          onMouseEnter={setHovered}
          onMouseLeave={unsetHovered}
          isDisabled={item.disableNavigation}
        >
          {item.icon && <UIIcon>{item.icon}</UIIcon>}
          <UILabel>{item.title}</UILabel>
          {!!childItems?.length && <UIDropdownIcon />}
        </UIHolder>
      </Link>
      <AnimatePresence>
        {childItems && childItems.length > 0 && shouldShowChildItems && (
          <Popover anchorRef={holderRef} placement="bottom-start">
            <UIPopoverMenuModal onMouseEnter={setHovered} onMouseLeave={unsetHovered}>
              {childItems.map((item) => {
                return <NavItem key={item.key} item={item} />;
              })}
            </UIPopoverMenuModal>
          </Popover>
        )}
      </AnimatePresence>
    </>
  );
})``;

const UIHolder = styled.a<{ isActive: boolean; isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;

  ${hoverActionCss}

  ${(props) =>
    props.isDisabled &&
    css`
      pointer-events: none;
    `}

  ${(props) => props.isActive && hoverActionActiveCss};
`;

const UILabel = styled.span`
  margin-left: 0.25em;
`;

const UIIcon = styled.div`
  font-size: 1.5em;
  margin-right: 0.25em;
`;

const UIDropdownIcon = styled(IconChevronDown)`
  margin-left: 8px;
`;
