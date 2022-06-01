import React, { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  className?: string;
  icon: ReactNode;
}

export function CircleIcon({ className, icon }: Props) {
  return <UIHolder className={className}>{icon}</UIHolder>;
}

const UIHolder = styled.div<{}>``;
