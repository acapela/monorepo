import Head from "next/head";
import React from "react";
import { MainLayout } from "@acapela/frontend/MainLayout";
import { RoomList } from "@acapela/frontend/rooms/roomList";
import { PageTitle } from "@acapela/ui/typo";
import { assignPageLayout } from "@acapela/frontend/utils/pageLayout";
import { withServerSideAuthRedirect } from "@acapela/frontend/authentication/withServerSideAuthRedirect";

const Page = function HomePage() {
  return (
    <>
      <Head>
        <title>Acapela</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageTitle>Upcoming Acapelas</PageTitle>
      <RoomList />
    </>
  );
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, MainLayout);

export default Page;
