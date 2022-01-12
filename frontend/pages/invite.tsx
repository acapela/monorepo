import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";

import { useCurrentUserTokenData } from "@aca/frontend/authentication/useCurrentUser";
import { useDb } from "@aca/frontend/clientdb";
import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { LoginOptionsView } from "@aca/frontend/views/LoginOptionsView";
import { addToast } from "@aca/ui/toasts/data";

export default observer(() => {
  const router = useRouter();

  const { teamId, invitingUserId } = router.query;

  const db = useDb();
  const userToken = useCurrentUserTokenData();
  const user = userToken ? db.user.findById(userToken.id) : null;
  const invitingUser = typeof invitingUserId == "string" ? db.user.findById(invitingUserId) : null;
  const team = typeof teamId == "string" ? db.team.findById(teamId) : null;

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.has_account) {
      addToast({ type: "success", title: "Redirecting you into your account" });
      router.push("/");
    }
  }, [router, user]);

  if (!user || user.has_account) {
    return null;
  }

  return (
    <FocusedActionLayout>
      <UIHolder>
        You have been invited {invitingUser && `by ${invitingUser.name} `}to join{" "}
        {team ? `the "${team.name}" team` : "Acapela"}.
        <div>
          <LoginOptionsView signupEmail={user.email} />
        </div>
      </UIHolder>
    </FocusedActionLayout>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;
`;
