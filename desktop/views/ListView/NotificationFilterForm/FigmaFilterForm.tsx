import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { findAndMap } from "@aca/shared/array";
import { None } from "@aca/shared/none";
import { typedKeys } from "@aca/shared/object";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";

import { IntegrationFilterFormProps } from "./shared";

const OPTIONS = {
  none: "None",
  all: "Comments and Mentions",
  onlyMentions: "Only Mentions",
};

export const FigmaFilterForm = observer(({ filters, produceFiltersUpdate }: IntegrationFilterFormProps) => {
  const figmaFilter = findAndMap(filters, (filter) => (filter.kind === "notification_figma_comment" ? filter : None));
  const selectedItem: keyof typeof OPTIONS = figmaFilter ? (figmaFilter.is_mention ? "onlyMentions" : "all") : "none";
  return (
    <UIHolder>
      <SingleOptionDropdown
        items={typedKeys(OPTIONS)}
        keyGetter={(key) => key}
        labelGetter={(key) => OPTIONS[key]}
        selectedItem={selectedItem}
        onChange={(selected) => {
          produceFiltersUpdate((filters) => {
            for (let i = 0; i < filters.length; i++) {
              const filter = filters[i];
              if (filter.kind === "notification_figma_comment") {
                delete filters[i];
              }
            }

            if (selected == "all") {
              filters.push({ kind: "notification_figma_comment" });
            } else if (selected == "onlyMentions") {
              filters.push({ kind: "notification_figma_comment", is_mention: true });
            }
          });
        }}
      />
    </UIHolder>
  );
});

export const UIHolder = styled.div`
  padding: 8px 0;
`;
