import React, { useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAcceptInviteMutation } from "@acapela/frontend/gql";
import { gql } from "@apollo/client";
import { authenticated } from "@acapela/frontend/authentication/authenticated";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { Logo } from "@acapela/frontend/design/Logo";
import { usePathParameter } from "@acapela/frontend/utils";
import { assert } from "@acapela/shared/assert";

const UILogoWrapper = styled.div`
  width: 16rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
`;

export default authenticated(function InvitePage() {
  const inviteCode = usePathParameter("inviteCode");

  assert(inviteCode, "Invite code required");

  return (
    <div>
      <Head>
        <title>Acapela</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UIContentWrapper marginTop>
        <UILogoWrapper>
          <Logo />
          <InviteAcceptor code={inviteCode} />
          <span>Loading...</span>
        </UILogoWrapper>
      </UIContentWrapper>
    </div>
  );
});

// We only create an apollo context once the user is authenticated.
// This means we cannot useMutation until this context is established.
// That in turn means we need to render this as a child only once the app is
// wrapped in an apollo context.
const InviteAcceptor = ({ code }: { code: string }): JSX.Element | null => {
  const { replace } = useRouter();
  const { acceptInvite } = useInviteAcceptance();

  useEffect(() => {
    async function acceptInviteAndRedirect() {
      const roomId = await acceptInvite(code);

      if (roomId) {
        return await replace(`/rooms/${roomId}`);
      }

      return await replace("/home");
    }

    acceptInviteAndRedirect();
  }, [code]);

  return null;
};

gql`
  mutation AcceptInvite($code: String!) {
    invite: accept_invite(code: $code) {
      roomId: room_id
    }
  }
`;

const useInviteAcceptance = () => {
  const [acceptInvite, { loading, error }] = useAcceptInviteMutation();

  return {
    loading,
    error,
    async acceptInvite(code: string): Promise<string | null> {
      const result = await acceptInvite({ variables: { code } });

      return result?.data?.invite?.roomId ?? null;
    },
  };
};
