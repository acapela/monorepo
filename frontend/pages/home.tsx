import Head from "next/head";
import React from "react";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { RoomList } from "~frontend/rooms/roomList";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { PageTitle } from "~ui/typo";

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

assignPageLayout(Page, AppLayout);

export default Page;
