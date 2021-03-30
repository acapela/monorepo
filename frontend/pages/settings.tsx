import Head from "next/head";
import React from "react";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { authenticated } from "../src/authentication/authenticated";
import { LogoutButton } from "../src/authentication/logout";
import { MainLayout } from "../src/MainLayout";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Page as any).getLayout = (page: any) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
