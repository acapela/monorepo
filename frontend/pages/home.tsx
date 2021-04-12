import Head from "next/head";
import React from "react";
import { authenticated } from "@acapela/frontend/authentication/authenticated";
import { MainLayout } from "@acapela/frontend/MainLayout";
import { RoomList } from "@acapela/frontend/rooms/roomList";
import { PageTitle } from "@acapela/ui/typo";
import { assignPageLayout } from "@acapela/frontend/utils/pageLayout";

const Page = authenticated(function HomePage() {
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
});

assignPageLayout(Page, MainLayout);

export default Page;
