import { ReactNode } from "react";
import styled from "styled-components";

import { borderRadius } from "~ui/baseStyles";

import { theme } from "../theme";
import { ThemeColorScheme } from "../theme/colors";

interface TagProps {
  children: ReactNode;
  tooltipLabel?: string;
  kind: keyof ThemeColorScheme["tags"];
}

export const Tag = ({ kind, children, tooltipLabel }: TagProps) => {
  return (
    <UITag data-tooltip={tooltipLabel} kind={kind}>
      {children}
    </UITag>
  );
};

const UITag = styled.button<{ kind: keyof ThemeColorScheme["tags"] }>`
  padding: 4px 8px;

  font-size: 0.75rem;

  color: ${(props) => theme.colors.tags[props.kind].foreground()};
  background-color: ${(props) => theme.colors.tags[props.kind].background()};
  ${borderRadius.tag};
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
