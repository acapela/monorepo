import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

interface Props {
  price: string;
  period: string;
  description: string;
}

export const Price = observer(({ price, period, description }: Props) => {
  return (
    <UIPriceAndDescription>
      <UIPrice>
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
  font-weight: 600;
  font-size: 36px;
  line-height: 1em;
  gap: 10px;
`;

const UIPriceLabel = styled.div``;

const UIPriceMeta = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 1em;
  line-height: 22px;
  /* identical to box height, or 133% */

  text-transform: uppercase;
  opacity: 0.5;
`;

const UIPriceIntro = styled.div`
  line-height: 1.5em;
`;
