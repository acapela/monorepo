import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { isLastItem } from "~shared/array";

export interface BreadcrumbsSegment {
  title: string;
  kind?: string;
  href: string;
  icon?: ReactNode;
}

interface Props {
  segments: BreadcrumbsSegment[];
}

export function BreadcrumbsSegments({ segments }: Props) {
  return (
    <UIHolder>
      <AnimatePresence>
        {segments.map((segment, index) => {
          const isLastSegment = isLastItem(segments, segment);
          return (
            <UISegment key={index} presenceStyles={{ opacity: [0, 1] }}>
              <UISegmentLabel>
                {segment.icon}
                <Link href={segment.href} passHref>
                  <UISingleSegmentHolder>
                    <AnimatePresence exitBeforeEnter>
                      <PresenceAnimator key={segment.title} presenceStyles={{ opacity: [0, 1] }}>
                        {segment.title}
                      </PresenceAnimator>
                    </AnimatePresence>
                  </UISingleSegmentHolder>
                </Link>
              </UISegmentLabel>
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

const UISegmentLabel = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;

  ${hoverActionCss}
`;

const UIHolder = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  svg {
    font-size: 1.25em;
    margin-right: 0.25em;
  }
`;

const UISingleSegmentHolder = styled.a``;
