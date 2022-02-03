export const getUserSlackInstallationFilter = ({ teamId, userId }: Partial<{ teamId: string; userId: string }>) => ({
  AND: [
    teamId ? { data: { path: ["team", "id"], equals: teamId } } : {},
    userId ? { data: { path: ["user", "id"], equals: userId } } : {},
  ],
});
