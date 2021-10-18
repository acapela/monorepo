import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";

import { NewRequest } from "./NewRequest";

export const NewRequestView = observer(function NewRequestView() {
  const db = useDb();
  const hasTeamMembers = db.teamMember.all.length > 1;

  return (
    <>
      {hasTeamMembers && (
        <UIDropFileHolder>
          <ClientSideOnly>
            <NewRequest />
          </ClientSideOnly>
        </UIDropFileHolder>
      )}
    </>
  );
});

const UIDropFileHolder = styled(DropFileContext)<{}>`
  height: 100%;
  width: 100%;
`;
