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

const UIHolder = styled.div``;

const UINavigationHolder = styled.div`
  padding: 20px;
`;

const UIActiveContentHolder = styled.div``;
