import styled from "styled-components";

import { DashboardNavigation } from "./Navigation/DashboardNavigation";

export function DashboardView() {
  return (
    <UIHolder>
      <UINavigationHolder>
        <DashboardNavigation />
      </UINavigationHolder>
      <UIActiveContentHolder>elsf</UIActiveContentHolder>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  grid-gap: 24px;
`;

const UINavigationHolder = styled.div`
  padding: 20px;
`;

const UIActiveContentHolder = styled.div``;
