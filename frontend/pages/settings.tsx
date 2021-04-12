import Head from "next/head";
import React from "react";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { authenticated } from "@acapela/frontend/authentication/authenticated";
import { LogoutButton } from "@acapela/frontend/authentication/logout";
import { MainLayout } from "@acapela/frontend/MainLayout";
import { assignPageLayout } from "@acapela/frontend/utils/pageLayout";

const Page = authenticated(function ActivePage() {
  return (
    <>
      <Head>
        <title>Acapela</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UIContentWrapper>
        <LogoutButton />
      </UIContentWrapper>
    </>
  );
});

assignPageLayout(Page, MainLayout);

export default Page;
