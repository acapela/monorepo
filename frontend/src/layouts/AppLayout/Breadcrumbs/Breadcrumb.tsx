import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { BASE_GREY_3, BASE_GREY_1 } from "~ui/theme/colors/base";
import { fontSize } from "~ui/baseStyles";
import { hoverTransition } from "~ui/transitions";
import Link from "next/link";

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

const UITitle = styled.div``;

const UIHolder = styled.div<{ isClickable: boolean; isSelected: boolean }>`
  display: flex;
  gap: 8px;

  color: ${(props) => (props.isSelected ? BASE_GREY_1 : BASE_GREY_3)};
  font-size: ${fontSize.navigation};
  ${hoverTransition()};

  ${(props) =>
    props.isClickable &&
    css`
      &:hover {
        color: ${BASE_GREY_1};
      }
    `}
`;
