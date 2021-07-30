import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { IconCalendar } from "~ui/icons";

interface Props {
  to: string;
  children?: ReactNode;
  className?: string;
}

export const NavLink = ({ to, children, className }: Props) => {
  const router = useRouter();
  const isActive = router.asPath === to;

  return (
    <Link href={to} passHref>
      <UILink isActive={isActive} className={className}>
        <UIIcon />
        <UILabel>{children}</UILabel>
      </UILink>
    </Link>
  );
};

const UILink = styled.a<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  font-weight: 500;
  padding: 0.75rem 1rem;
  margin: 0 -1rem;
  ${borderRadius.menu};

  ${(props) =>
    props.isActive &&
    css<{}>`
      background-color: #efefef;
    `}
`;

const UIIcon = styled(IconCalendar)`
  margin-right: 0.5rem;
`;

const UILabel = styled.span``;
