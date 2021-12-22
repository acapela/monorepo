import { useEffect } from "react";
import styled from "styled-components";

import { assert } from "~shared/assert";
import { IS_DEV } from "~shared/dev";
import { theme } from "~ui/theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getBlocksPreviewUrl(result: any): string {
  const baseUri = "https://app.slack.com/block-kit-builder/#";
  const stringifiedBlocks = result.blocks
    ? JSON.stringify(result)
    : JSON.stringify({ blocks: result, attachments: [] });

  return encodeURI(`${baseUri}${stringifiedBlocks}`).replace(/[!'()*]/g, escape);
}

export default function DevContentPage() {
  assert(IS_DEV, "Dev only page");

  useEffect(() => {
    fetch("/api/backend/v1/dev/slack-blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "foo",
      }),
    }).then((res) => {
      res.json().then((blocks) => {
        const preview = getBlocksPreviewUrl(blocks);
        console.info(preview);
      });
    });
  }, []);

  return (
    <UIHolder>
      <UILabel>Check console for slack preview url</UILabel>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  max-width: 1240px;
  margin: auto;
  display: flex;
  flex-direction: column;
  ${theme.spacing.pageSections.asGap}
`;

const UILabel = styled.div`
  ${theme.typo.pageTitle};
`;
