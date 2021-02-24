import Head from "next/head";
import React from "react";
import { authenticated } from "../src/authentication/authenticated";
import { MainLayout } from "../src/MainLayout";
import { RoomList } from "../src/rooms/roomList";

const Page = authenticated(function HomePage() {
  return (
    <>
      <Head>
        <title>Acapela</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="font-semibold text-4xl mb-8">Upcoming Acapelas</h1>
      <RoomList />
    </>
  );
});

(Page as any).getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
