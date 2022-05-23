import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { goToComposeView } from "@aca/desktop/actions/compose";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { getIntegrationAccountComposers } from "@aca/desktop/domains/integrations";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { DEFAULT_ICON_SIZE_RATIO } from "@aca/ui/buttons/IconButton";
import { getButtonKindStyles, getButtonSizeStyles } from "@aca/ui/buttons/variants";
import { IconEdit } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

export const ComposeButton = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useIsElementOrChildHovered(ref);

  const composers = getIntegrationAccountComposers();
  if (composers.length == 0) {
    return null;
  }
  return (
    <UIHolder ref={ref}>
      <UIButtons initial={false} animate={isHovered ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}>
        {composers.map(({ client, account, url }, i) => (
          <React.Fragment key={i}>
            <UIActionIconButton
              showTitleInTooltip
              size="compactWide"
              kind="transparent"
              action={goToComposeView}
              target={{ integration: client, account }}
            />
            <PreloadEmbed url={url} priority={PreviewLoadingPriority.next} />
          </React.Fragment>
        ))}
      </UIButtons>
      <UIIconWrap initial={false} animate={isHovered ? { y: 20, opacity: 0 } : { y: 0, opacity: 1 }}>
        <IconEdit />
      </UIIconWrap>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  position: relative;
  // With drag enabled, hover does not properly work
  -webkit-app-region: no-drag;
`;

const UIButtons = styled(motion.div)`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const UIIconWrap = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  top: 0;

  ${theme.radius.button};
  ${getButtonKindStyles("transparent")};
  ${getButtonSizeStyles("compactWide").square};

  svg {
    font-size: ${DEFAULT_ICON_SIZE_RATIO}em;
  }
`;

const UIActionIconButton = styled(ActionIconButton)`
  > * {
    position: relative;
    width: 1.5em;
    height: 1.5em;
  }
`;
