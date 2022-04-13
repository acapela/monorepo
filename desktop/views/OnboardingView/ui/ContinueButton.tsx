import React from "react";
import styled from "styled-components";

import { Button } from "@aca/ui/buttons/Button";

type OnboardingContinueButtonKind = "primary" | "indicate-not-complete" | "disabled";

interface Props {
  label: string;
  onClick: () => void;
  kind?: OnboardingContinueButtonKind;
}

export function OnboardingContinueButton({ label, onClick, kind = "primary" }: Props) {
  kind;
  return (
    <UIHolder>
      <Button kind="primary" size="primary" onClick={onClick} isWide>
        {label}
      </Button>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  width: min(100%, 260px);
`;
