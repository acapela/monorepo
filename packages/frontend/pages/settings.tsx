import Head from "next/head";
import React from "react";
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
      <div className="md:flex p-16 justify-center">
        <LogoutButton />
      </div>
    </>
  );
});

(Page as any).getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
