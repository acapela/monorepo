export const SUPPORTED_FIELDS = [
  "summary",
  "attachment",
  "description",
  "duedate",
  "timeoriginalestimate",
  "priority",
  "labels",
  "reporter",
];

export const jiraIssueFieldAlias: Record<typeof SUPPORTED_FIELDS[number], string> = {
  summary: "Title",
  description: "Description",
  attachment: "Attachment",
  duedate: "Due Date",
  timeoriginalestimate: "Original Estimate",
  priority: "Priority",
  labels: "Labels",
  reporter: "Issue Reporter",
};
