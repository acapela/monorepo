import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { useCurrentUser } from "../../src/authentication/authentication";
// import { useAuthentication, LoginMethod } from "../../src/authentication/authentication";
import { Logo } from "../../src/design/Logo";
import { usePathParameter } from "../../src/utils";

export default function InvitePage() {
  const inviteCode = usePathParameter("inviteCode");
  const { loading, user } = useCurrentUser();

  const authenticated = !loading && !!user;

  useEffect(() => {
    // TODO: next-auth dont support annonymous auth and we'll have to implement it manually.
    // if (!authenticated && !loggingIn && !loading) {
    //   login(LoginMethod.ANONYMOUS);
    // }
  }, [authenticated, loading]);

  return (
    <div className="w-max-md mx-auto text-center mt-64">
      <div className="w-64 mx-auto mb-4">
        <Logo />
        {authenticated && <InviteAcceptor code={inviteCode} />}
        Loading...
      </div>
    </div>
  );
}

// We only create an apollo context once the user is authenticated.
// This means we cannot useMutation until this context is established.
// That in turn means we need to render this as a child only once the app is
// wrapped in an apollo context.
const InviteAcceptor = ({ code }: { code: string }): JSX.Element => {
  const { replace } = useRouter();
  const { acceptInvite } = useInviteAcceptance();
  useEffect(() => {
    async function acceptInviteAndRedirect() {
      const roomId = await acceptInvite(code);
      replace(`/rooms/${roomId}`);
    }
    acceptInviteAndRedirect();
  }, [code]);
  return <Fragment />;
};

const ACCEPT_INVITE = gql`
  mutation AcceptInvite($code: String!) {
    invite: accept_invite(code: $code) {
      roomId: room_id
    }
  }
`;

const useInviteAcceptance = () => {
  const [acceptInvite, { loading, error }] = useMutation(ACCEPT_INVITE);

  return {
    loading,
    error,
    async acceptInvite(code: string): Promise<string> {
      const result = await acceptInvite({ variables: { code } });
      return result.data.invite.roomId;
    },
  };
};
