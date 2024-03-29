import React from "react";
import styled from "styled-components";

import { Button } from "@aca/ui/buttons/Button";

import { OnboardingAnimationItem } from "./enterAnimations";

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
      <Button kind="primary" size="primary" onClick={onClick} isWide isDisabled={kind === "disabled"}>
        {label}
      </Button>
    </UIHolder>
  );
}

const UIHolder = styled(OnboardingAnimationItem)`
  width: min(100%, 260px);
`;
