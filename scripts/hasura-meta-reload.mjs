/* global $ */

await $`hasura metadata reload --project infrastructure/hasura --admin-secret dev`;

try {
  await $`hasura metadata inconsistency status --project infrastructure/hasura --admin-secret dev`;
} catch (e) {
  await $`hasura metadata inconsistency list --project infrastructure/hasura --admin-secret dev`;
  process.exit(1);
}
