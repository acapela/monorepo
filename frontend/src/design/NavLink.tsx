import { useRouter } from "next/router";

import Link from "next/link";
import styled, { css } from "styled-components";
import { CalendarOutline } from "@acapela/ui/icons";
import { borderRadius } from "@acapela/ui/baseStyles";
import { boolPropStyles } from "@acapela/ui/styleHelpers";

export const NavLink: React.FC<{
  to?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ to, children, className }) => {
  const router = useRouter();
  const isActive = router.asPath === to;

  return (
    <Link href={to}>
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
  border-radius: ${borderRadius.medium};

  ${(props) =>
    props.isActive &&
    css`
      background-color: #efefef;
    `}
`;

const UIIcon = styled(CalendarOutline)`
  margin-right: 0.5rem;
`;

const UILabel = styled.span``;
