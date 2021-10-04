import React from "react";

import { LogoutButton } from "~frontend/authentication/logout";
import { MainLayout } from "~frontend/MainLayout";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { assignPageLayout } from "~frontend/utils/pageLayout";

const Page = function ActivePage() {
  return (
    <>
      <UIContentWrapper>
        <LogoutButton />
      </UIContentWrapper>
    </>
  );
};

assignPageLayout(Page, MainLayout);

export default Page;
