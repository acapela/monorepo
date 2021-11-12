import styled from "styled-components";

import { logout } from "~frontend/auth/logout";
import { increaseClientDBForceRefreshCount } from "~frontend/clientdb/recoveryCounter";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

export function AppRecoveryButtons() {
  return (
    <UIFallbackHolder>
      <Button
        isWide
        kind="primary"
        onClick={() => {
          increaseClientDBForceRefreshCount();
          window.location.reload();
        }}
      >
        Reload
      </Button>
      <Button
        isWide
        onClick={() => {
          increaseClientDBForceRefreshCount();
          logout();
        }}
      >
        Log out
      </Button>
    </UIFallbackHolder>
  );
}

const UIFallbackHolder = styled.div`
  display: flex;
  ${theme.spacing.actions.asGap};
  min-width: 280px;
`;
