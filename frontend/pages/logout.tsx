import { signOut } from "next-auth/react";
import { useEffect } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { theme } from "~ui/theme";

export default function LogoutPage() {
  useEffect(() => {
    trackEvent("Signed Out");
    signOut({ callbackUrl: "/" });
  }, []);

  return <UIHolder>Logging out...</UIHolder>;
}

const UIHolder = styled.div`
  display: flex;
  height: 100vh;
  ${theme.gradients.actionPageBg.asBg};
  align-items: center;
  justify-content: center;
  ${theme.font.bold};
  color: #fff;
`;
