import { observer } from "mobx-react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { AutocompleteNodeProps } from "~richEditor/autocomplete/component";
import { EditorRequestLinkData } from "~shared/types/editor";
import { IconComments } from "~ui/icons";
import { theme } from "~ui/theme";

export const RequestLinkNode = observer((props: PropsWithChildren<AutocompleteNodeProps<EditorRequestLinkData>>) => {
  const { data } = props;
  const { requestId } = data;
  const db = useDb();
  const request = db.topic.findById(requestId);

  return (
    <Link href={request?.href ?? "/"} passHref>
      <UIRequestLink data-tooltip="Open linked request">
        <IconComments /> {request?.name ?? "Unknown request"}
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
