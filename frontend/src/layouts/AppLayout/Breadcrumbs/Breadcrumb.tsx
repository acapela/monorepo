import Link from "next/link";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { theme } from "~ui/theme";

export interface Props {
  href?: string;
  icon?: ReactNode;
  title: string;
  isSelected?: boolean;
}

export const Breadcrumb = ({ href, icon, title, isSelected = false }: Props) => {
  const isClickable = Boolean(href);

  const breadcrumbElement = (
    <UIHolder isSelected={isSelected} as={isClickable ? "a" : "div"} isClickable={isClickable}>
      {icon}
      <UITitle>{title}</UITitle>
    </UIHolder>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        {breadcrumbElement}
      </Link>
    );
  }

  return breadcrumbElement;
};

const UITitle = styled.div<{}>``;

const UIHolder = styled.div<{ isClickable: boolean; isSelected: boolean }>`
  display: flex;
  gap: 8px;

  color: ${(props) =>
    props.isSelected ? props.theme.colors.layout.bodyText : props.theme.colors.layout.supportingText};

  ${theme.transitions.hover()}

  ${(props) =>
    props.isClickable &&
    css<{}>`
      &:hover {
        color: ${theme.colors.layout.bodyText};
      }
    `}
`;
