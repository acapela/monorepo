import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { integrationClients } from "@aca/desktop/domains/integrations";
import { desktopRouter } from "@aca/desktop/routes";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { DEFAULT_ICON_SIZE_RATIO, IconButton } from "@aca/ui/buttons/IconButton";
import { getButtonKindtyles, getButtonSizeStyles } from "@aca/ui/buttons/variants";
import { IconEdit } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

const HEIGHT = 28;

const IconWrap = styled(motion.div)`
  ${theme.radius.button};
  ${getButtonKindtyles("transparent")};
  ${getButtonSizeStyles("compactWide").square};

  svg {
    font-size: ${DEFAULT_ICON_SIZE_RATIO}em;
  }
`;

export const ComposeButton = observer(() => {
  // const ref = useRef<HTMLDivElement>(null);
  // const isHovered = useIsElementOrChildHovered(ref);
  const [isHovered, { toggle }] = useBoolean(false);

  const composers = Object.values(integrationClients)
    .filter((client) => client.getAccounts().length > 0)
    .flatMap((client) => (client.getComposeURLs?.() ?? []).map(({ url }) => ({ url, icon: client.icon })));
  if (composers.length == 0) {
    return null;
  }
  return (
    <UIHolder onClick={toggle}>
      <UIButtons initial={false} animate={isHovered ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}>
        {composers.map(({ url, icon }, i) => (
          <React.Fragment key={i}>
            <IconButton
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
      <IconWrap initial={false} animate={isHovered ? { y: 0, opacity: 0 } : { y: -HEIGHT, opacity: 1 }}>
        <IconEdit />
      </IconWrap>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  height: ${HEIGHT}px;
  overflow: hidden;
`;

const UIButtons = styled(motion.div)`
  display: flex;
  flex-direction: row;
  position: relative;
  top: -4px;
  height: ${HEIGHT}px;
`;
