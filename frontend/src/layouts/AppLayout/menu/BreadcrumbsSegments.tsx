import Link from "next/link";
import { Fragment, ReactNode } from "react";
import styled from "styled-components";

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
      {segments.map((segment) => {
        return (
          <Fragment key={segment.title}>
            {segment.icon}
            <Link href={segment.href} passHref>
              <UISingleSegmentHolder>{segment.title}</UISingleSegmentHolder>
            </Link>
            <UILimiter>/</UILimiter>
          </Fragment>
        );
      })}
    </UIHolder>
  );
}

const UILimiter = styled.div`
  margin: 0 0.5em;
  opacity: 0.25;
  font-size: 1.25em;

  &:last-child {
    display: none;
  }
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
