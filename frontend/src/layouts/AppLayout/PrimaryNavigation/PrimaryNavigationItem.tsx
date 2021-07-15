import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useIsRoutePathActive } from "~frontend/routes";
import { activeTransparentButtonStyles } from "~ui/buttons/Button";
import { Button } from "~ui/buttons/Button";

interface Props {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export const PrimaryNavigationItem = ({ title, icon, href }: Props) => {
  const isActive = useIsRoutePathActive(href);

  return (
    <Link href={href} passHref>
      <UIHolder kind="transparent" iconPosition="start" icon={icon} isActive={isActive}>
        {title}
      </UIHolder>
    </Link>
  );
};

const UIHolder = styled(Button)<{ isActive: boolean }>`
  padding: 5px 12px;
  ${(props) => props.isActive && activeTransparentButtonStyles};
`;
