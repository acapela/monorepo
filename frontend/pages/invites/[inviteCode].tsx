import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAcceptInviteMutation } from "@acapela/frontend/gql";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { UILogoWrapper } from "@acapela/frontend/design/UILogoWrapper";
import { Logo } from "@acapela/frontend/design/Logo";
import { usePathParameter } from "@acapela/frontend/utils";
import { assert } from "@acapela/shared/assert";

import { withServerSideAuthRedirect } from "@acapela/frontend/authentication/withServerSideAuthRedirect";

export default function InvitePage() {
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
}

export const getServerSideProps = withServerSideAuthRedirect();

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
