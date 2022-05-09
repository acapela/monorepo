import React from "react";
import styled, { css, keyframes } from "styled-components";

import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconSend } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import {
  FakeContentAnimationsOrchestrator,
  FakeContentItem,
  FakeLabel,
  FakeMenu,
  FakeMessage,
  FakeUserList,
} from "./fakeContent";
import { GuideItem } from "./Guide";

export interface FakeIntegrationScreenProps {
  onSent?: () => void;
  integrationClient?: IntegrationClient;
}

export function FakeIntegrationScreen({ onSent, integrationClient }: FakeIntegrationScreenProps) {
  return (
    <UIHolder>
      <UISidebar>
        <UILogo>
          <IntegrationIcon integrationClient={integrationClient ?? slackIntegrationClient} />
        </UILogo>
        <FakeMenu count={3} />
        <FakeUserList count={2} />
      </UISidebar>
      <UIBody>
        <FakeMessage lines={2} />
        <FakeMessage lines={1} />
        <UIBodyFooter>
          <UIComposer>
            <UIComposerInput>
              <FakeLabel min={10} max={20} />
              {!!onSent && <UICursor />}
            </UIComposerInput>
            <FakeContentItem>
              <GuideItem isDisabled={!onSent} index={3} content="You can reply or comment inside opened notification">
                {(complete) => (
                  <IconButton
                    isDisabled={!onSent}
                    icon={<IconSend />}
                    tooltip="Send message"
                    onClick={() => {
                      complete();
                      onSent?.();
                    }}
                  />
                )}
              </GuideItem>
            </FakeContentItem>
          </UIComposer>
        </UIBodyFooter>
      </UIBody>
    </UIHolder>
  );
}

const UIHolder = styled(FakeContentAnimationsOrchestrator)`
  min-height: 200px;
  display: flex;
  flex-direction: row;
`;

const spacing = css`
  padding: 20px;
`;

const UISidebar = styled.div`
  ${spacing};
  flex-grow: 1;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const UILogo = styled(FakeContentItem)`
  font-size: 32px;
`;

const UIBody = styled.div`
  ${spacing};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UIBodyFooter = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: flex-end;
`;

const UIComposer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
  border-top: 1px solid ${theme.colors.layout.divider.value};
  padding-top: 10px;
  margin-top: 10px;
`;

const UIComposerInput = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const blink = keyframes`
  0%, 100% {
    opacity: 0;
  }

  50% {
    opacity: 1
  }
`;

const UICursor = styled.div`
  ${theme.colors.text.opacity(0.5).asBg};
  width: 2px;
  height: 1.5em;
  border-radius: 1px;
  animation: ${blink} 1.5s infinite ease-in-out;
`;
