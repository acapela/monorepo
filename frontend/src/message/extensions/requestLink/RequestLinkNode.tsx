import { observer } from "mobx-react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import styled from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { AutocompleteNodeProps } from "@aca/richEditor/autocomplete/component";
import { EditorRequestLinkData } from "@aca/shared/types/editor";
import { IconComments } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

export const RequestLinkNode = observer((props: PropsWithChildren<AutocompleteNodeProps<EditorRequestLinkData>>) => {
  const { data } = props;
  const { requestId } = data;
  const db = useDb();
  const request = db.topic.findById(requestId);

  const hasAccess = !!request;

  if (!hasAccess) {
    return (
      <UIRequestLink data-tooltip="You're not member of this topic. Please ask other team members to add you to discussion in order to be able to see it.">
        <IconComments /> {data.originalTopicName ?? "Unknown request"} (no access)
      </UIRequestLink>
    );
  }

  return (
    <Link href={request?.href ?? "/"} passHref>
      <UIRequestLink data-tooltip="Open linked request">
        <IconComments /> {request?.name ?? data.originalTopicName ?? "Unknown request"}
      </UIRequestLink>
    </Link>
  );
});

const UIRequestLink = styled.a`
  display: inline-flex;
  align-items: center;
  ${theme.colors.primary.asColor};
  ${theme.typo.content.semibold};
  font-size: inherit;

  svg {
    margin-right: 0.5ch;
  }
`;
