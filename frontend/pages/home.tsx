import Head from "next/head";
import React from "react";
import { authenticated } from "../src/authentication/authenticated";
import { MainLayout } from "../src/MainLayout";
import { RoomList } from "../src/rooms/roomList";
import { PageTitle } from "@acapela/ui/typo";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Page as any).getLayout = (page: any) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
