import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { PremiumPlanView } from "@aca/desktop/views/PremiumPlan/PremiumPlanView";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconArrowRight, IconCross } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

export const UpgradePlanBadge = observer(function OnboardingView() {
  const [isUpgrading, setIsUpgrading] = useState(false);

  return (
    <UIHolder
      onClick={() => {
        setIsUpgrading(true);
      }}
    >
      <UIIcon src={integrationLogos.google} />
      <UILabel>
        Upgrade to <UIPlanLabel>Acapela Ultimate</UIPlanLabel> to connect your complete Google Suite.
      </UILabel>
      <IconArrowRight />
      <BodyPortal>
        <AnimatePresence>
          {isUpgrading && (
            <UIUpgradeModal>
              <UICloseButton>
                <IconButton
                  icon={<IconCross />}
                  onClick={() => {
                    setIsUpgrading(false);
                  }}
                />
              </UICloseButton>
              <PremiumPlanView
                onPlanChanged={() => {
                  setIsUpgrading(false);
                }}
              />
            </UIUpgradeModal>
          )}
        </AnimatePresence>
      </BodyPortal>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  ${theme.colors.layout.backgroundAccent.withBorder.interactive}
  ${theme.transitions.hover()}
  ${theme.box.panel.toast.padding.radius}

  svg {
    ${theme.iconSize.section};
  }
`;

const UIPlanLabel = styled.span`
  ${theme.colors.primary.asColor};
  font-weight: 500;
`;

const UIIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const UILabel = styled.div``;

const UIUpgradeModal = styled(FadePresenceAnimator)`
  position: fixed;
  inset: 0;
  padding: 24px;
  ${theme.colors.layout.background.asBgWithReadableText};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.overlay};

  ${PremiumPlanView} {
    max-width: 960px;
  }
`;

const UICloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;
