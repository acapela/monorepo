import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { IntegrationAccount, IntegrationClient } from "./types";

interface Props {
  // TODO: we have 'png' imports type conflict with next.js
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  integrationClient: IntegrationClient;
  account?: IntegrationAccount;
}

export const IntegrationIcon = observer(({ integrationClient, account }: Props) => (
  <UIIcon style={{ backgroundImage: `url(${integrationClient.imageURL})` }}>
    {integrationClient.getAccounts().length > 1 && account?.imageURL && (
      <UIAccountIcon style={{ backgroundImage: `url(${account.imageURL})` }} />
    )}
  </UIIcon>
));

const UIIcon = styled.div`
  height: 1em;
  width: 1em;
  border-radius: 0.25em;
  background-size: cover;

  position: relative;

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    border: 1px solid rgba(0, 0, 0, 0.12);
    z-index: 2;
    border-radius: inherit;
  }
`;

const UIAccountIcon = styled.div`
  width: 100%;
  height: 100%;
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: right bottom;
  position: relative;
  right: -2px;
  bottom: -2px;
`;
