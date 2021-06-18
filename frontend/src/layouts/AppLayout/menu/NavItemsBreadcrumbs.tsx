import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { isLastItem } from "~shared/array";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { NavItem, NavItemInfo } from "./NavItem";

interface Props {
  segments: NavItemInfo[];
}

export function NavItemsBreadcrumbs({ segments }: Props) {
  return (
    <UIHolder>
      <AnimatePresence>
        {segments.map((segment, index) => {
          const isLastSegment = isLastItem(segments, segment);
          return (
            <UISegment key={index} presenceStyles={{ opacity: [0, 1] }}>
              <NavItem item={segment} />
              {!isLastSegment && <UILimiter>/</UILimiter>}
            </UISegment>
          );
        })}
      </AnimatePresence>
    </UIHolder>
  );
}

const UILimiter = styled.div`
  margin: 0 0.5em;
  opacity: 0.25;
  font-size: 1.25em;
  user-select: none;
  position: relative;
`;

const UISegment = styled(PresenceAnimator)`
  display: flex;
  align-items: center;
`;

const UIHolder = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;
