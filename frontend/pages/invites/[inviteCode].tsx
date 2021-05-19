import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { Logo } from "~frontend/ui/Logo";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { UILogoWrapper } from "~frontend/ui/UILogoWrapper";
import { useAcceptInviteMutation } from "~frontend/gql/invitations";
import { usePathParameter } from "~frontend/utils";
import { assert } from "~shared/assert";
import { routes } from "~frontend/../routes";
import { TeamInvitationView } from "~frontend/views/TeamInvitationView";

export default function InvitePage() {
  const { inviteCode } = routes.invitePage.useParams();

  assert(inviteCode, "Invite code required");

  return <TeamInvitationView code={inviteCode} />;
}

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

      return await replace("/");
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
    async acceptInvite(token: string): Promise<string | null> {
      const result = await acceptInvite({ token });

      return result?.data?.invite?.team?.id ?? null;
    },
  };
};
