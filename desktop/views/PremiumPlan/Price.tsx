import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  price: string;
  period: string;
  description: string;
  originalPrice?: string;
}

export const Price = observer(({ price, period, description, originalPrice }: Props) => {
  return (
    <UIPriceAndDescription>
      <UIPrice>
        {originalPrice && <UICrossedPriceLabel>{originalPrice}</UICrossedPriceLabel>}
        <UIPriceLabel>{price}</UIPriceLabel>

        <UIPriceMeta>/ {period}</UIPriceMeta>
      </UIPrice>
      <UIPriceIntro>{description}</UIPriceIntro>
    </UIPriceAndDescription>
  );
});

const UIPriceAndDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIPrice = styled.div`
  display: flex;
  align-items: flex-end;
  ${theme.typo.pageTitle.resetLineHeight};
  gap: 10px;
`;

const UIPriceLabel = styled.div``;

const UICrossedPriceLabel = styled.div`
  text-decoration: line-through;
  opacity: 0.5;
`;

const UIPriceMeta = styled.div`
  ${theme.typo.noteTitle.secondary};

  text-transform: uppercase;
`;

const UIPriceIntro = styled.div`
  line-height: 1.5em;
`;
