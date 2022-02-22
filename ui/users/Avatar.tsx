import { first } from "lodash";
import React from "react";
import styled from "styled-components";

interface Props {
  src?: string | null;
  name?: string | null;
  className?: string;
}

export const Avatar = styled(function Avatar({ src, name, className }: Props) {
  return (
    <UIAvatar data-tooltip={name} style={{ backgroundImage: `url(${src})` }} className={className}>
      {!src && <UIName>{first(name)?.toUpperCase()}</UIName>}
    </UIAvatar>
  );
})``;

export const OverlayingAvatars = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  ${Avatar} {
    margin-right: -8px;
  }
`;

const UIAvatar = styled.div`
  height: 1em;
  width: 1em;
  min-width: 1em;
  border-radius: 1em;
  background-size: cover;
  background-position: center;
  background-color: #8884;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIName = styled.div`
  font-size: 0.5em;
  font-weight: 500;
`;
