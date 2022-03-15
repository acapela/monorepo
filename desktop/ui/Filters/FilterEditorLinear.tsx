import { gql, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { linearIntegrationClient } from "@aca/desktop/domains/integrations/linear";
import { LinearUsersQuery } from "@aca/gql";

import { ServiceUsersFilterRow } from "./ServiceUsersFilterRow";
import { NotificationFilterKind } from "./types";

type LinearFilter = NotificationFilterKind<"notification_linear">;

interface Props {
  filter: LinearFilter;
  onChange: (filter: LinearFilter) => void;
}

export function useLinearUsers() {
  const { data } = useQuery<LinearUsersQuery>(
    gql`
      query LinearUsers {
        linear_users {
          id
          display_name
          real_name
          avatar_url
        }
      }
    `
  );

  return data?.linear_users ?? [];
}

export function FilterEditorLinear({ filter, onChange }: Props) {
  const linearUsers = useLinearUsers();

  return (
    <UIHolder>
      <ServiceUsersFilterRow<LinearFilter>
        integrationClient={linearIntegrationClient}
        users={linearUsers}
        filter={filter}
        field="creator_id"
        onChange={onChange}
      />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
