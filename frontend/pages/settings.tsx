import Head from "next/head";
import React from "react";
import { LogoutButton } from "~frontend/authentication/logout";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { UIContentWrapper } from "~frontend/design/UIContentWrapper";
import { MainLayout } from "~frontend/MainLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";

export const getServerSideProps = withServerSideAuthRedirect();

const Page = function ActivePage() {
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
};

assignPageLayout(Page, MainLayout);

export default Page;
