import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  label: string;
  icon: ReactNode;
  href: string;
  className?: string;
}

export const NavItem = styled(({ label, icon, href, className }: Props) => {
  return (
    <Link href={href} passHref>
      <UIHolder className={className}>
        {icon}
        <UILabel>{label}</UILabel>
      </UIHolder>
    </Link>
  );
})``;

const UIHolder = styled.a`
  display: flex;
  align-items: center;
`;

const UILabel = styled.span`
  margin-left: 0.25em;
`;
