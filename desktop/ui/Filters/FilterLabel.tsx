import { action } from "mobx";
import { observer } from "mobx-react";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useContextMenu } from "@aca/desktop/domains/contextMenu/useContextMenu";
import { Button } from "@aca/ui/buttons/Button";

interface Props {
  icon: ReactNode;
  label: string;
  isFilled?: boolean;
  onClearRequest?: () => void;
  onClick?: () => void;
}

export const FilterLabel = observer(function FilterLabel({ icon, label, isFilled, onClearRequest, onClick }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const labelNameRef = useRef<HTMLDivElement>(null);

  useContextMenu(labelRef, () => [
    {
      label: "Remove filter",
      enabled: isFilled,
      onSelected: () => {
        onClearRequest?.();
      },
    },
  ]);

  return (
    <>
      <UILabel ref={labelRef}>
        <Button
          icon={icon}
          onClick={action(() => {
            onClick?.();
          })}
          kind={isFilled ? "primarySubtle" : "secondary"}
        >
          <UILabelParts ref={labelNameRef}>
            <span>{label}</span>
          </UILabelParts>
        </Button>
      </UILabel>
    </>
  );
});

const UILabel = styled.div``;

const UILabelParts = styled.div`
  display: flex;
  gap: 1ch;
  align-items: center;
`;
