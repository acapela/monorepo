import { $ } from "zx";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
process.env.FORCE_COLOR = 3;

async function start() {
  await $`yarn run docker:up:detach`;
  await $`yarn hasura:update`;
  await $`yarn db update`;

  await Promise.all([
    $`yarn frontend:dev`,
    $`yarn backend:dev`,
    $`yarn tooling:gql-types`,
    $`yarn hasura:console`,
    $`yarn desktop dev`,
  ]);
}

start();
