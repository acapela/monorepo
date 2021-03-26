import Head from "next/head";
import React from "react";
import styled from "styled-components";
import { authenticated } from "../src/authentication/authenticated";
import { LogoutButton } from "../src/authentication/logout";
import { MainLayout } from "../src/MainLayout";

const UIContentWrapper = styled.div`
  display: flex;
  padding: 4rem;
  justify-content: center;
`;

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
