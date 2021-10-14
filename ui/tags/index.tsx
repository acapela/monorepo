import { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "../theme";

type TagKind = keyof typeof tagsColorsMap;

const tagsColorsMap = {
  //  TODO PR
  private: theme.colors.primary,
  shareInformation: theme.colors.primary,
  discussion: theme.colors.primary,
};
interface TagProps {
  children: ReactNode;
  tooltipLabel?: string;
  kind: TagKind;
}

export const Tag = ({ kind, children, tooltipLabel }: TagProps) => {
  return (
    <UITag data-tooltip={tooltipLabel} kind={kind}>
      {children}
    </UITag>
  );
};

const UITag = styled.button<{ kind: TagKind }>`
  padding: 4px 8px;

  font-size: 0.75rem;

  ${(props) => tagsColorsMap[props.kind].asBgWithReadableText};
  ${theme.radius.secondaryItem};
`;

export const PrivateTag = ({ tooltipLabel }: Pick<TagProps, "tooltipLabel">) => (
  <Tag tooltipLabel={tooltipLabel} kind="private">
    Private
  </Tag>
);

export const ShareInformationTag = ({ tooltipLabel }: Pick<TagProps, "tooltipLabel">) => (
  <Tag tooltipLabel={tooltipLabel} kind="shareInformation">
    Share Information
  </Tag>
);

export const DiscussionTag = ({ tooltipLabel }: Pick<TagProps, "tooltipLabel">) => (
  <Tag tooltipLabel={tooltipLabel} kind="discussion">
    Discussion
  </Tag>
);
