import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { desktopRouter } from "@aca/desktop/routes";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { DEFAULT_ICON_SIZE_RATIO, IconButton } from "@aca/ui/buttons/IconButton";
import { getButtonKindtyles, getButtonSizeStyles } from "@aca/ui/buttons/variants";
import { IconEdit } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

const IconWrap = styled(motion.div)`
  ${theme.radius.button};
  ${getButtonKindtyles("transparent")};
  ${getButtonSizeStyles("compactWide").square};

  svg {
    font-size: ${DEFAULT_ICON_SIZE_RATIO}em;
  }
`;

export const ComposeButton = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useIsElementOrChildHovered(ref);

  const composers = Object.values(integrationClients)
    .filter((client) => client.getAccounts().length > 0)
    .flatMap((client) => (client.getComposeURLs?.() ?? []).map(({ url }) => ({ url, icon: client.icon })));
  if (composers.length == 0) {
    return null;
  }
  return (
    <UIHolder ref={ref}>
      <UIButtons initial={false} animate={isHovered ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}>
        {composers.map(({ url, icon }, i) => (
          <React.Fragment key={i}>
            <UIIconButton
              key={i}
              icon={icon}
              onClick={() => {
                desktopRouter.navigate("compose", { url });
              }}
            />
            <PreloadEmbed url={url} priority={PreviewLoadingPriority.next} />
          </React.Fragment>
        ))}
      </UIButtons>
      <IconWrap initial={false} animate={isHovered ? { y: "100%", opacity: 0 } : { y: 0, opacity: 1 }}>
        <IconEdit />
      </IconWrap>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  height: 28px;
  overflow: hidden;
`;

const UIButtons = styled(motion.div)`
  display: flex;
  flex-direction: row;
  gap: 4px;
  position: absolute;
  top: 8px;
`;

const UIIconButton = styled(IconButton)`
  > * {
    width: 1.5em;
    height: 1.5em;
  }
`;
