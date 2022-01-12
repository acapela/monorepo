import { sampleSize } from "lodash";
import { useMemo } from "react";

import { useDb } from "@aca/frontend/clientdb";

/**
 * Creates a placeholder with up to 2 random team members mentioned
 * The current user won't be included
 */
export function useMessageContentExamplePlaceholder(): string {
  const db = useDb();

  const exampleRequestBodyWithTeamMemberNamesMentioned = useMemo(() => {
    const otherTeamMembers = db.user.query({ isCurrentUser: false }).query((user) => user.isMemberOfCurrentTeam).all;

    if (!otherTeamMembers.length) {
      return `@Name Could you give me feedback on this Figma file?`;
    }

    const exampleUsers = sampleSize(otherTeamMembers, 2);

    const sampleMentionText = exampleUsers.map((user) => `@${user.name || "???"} `);

    return `${sampleMentionText.join(" ")} Could you give me feedback on this Figma file?`;
  }, [db]);

  return exampleRequestBodyWithTeamMemberNamesMentioned;
}
