module.exports = {
  client: {
    includes: ["./**/*.{ts,tsx}"],
    excludes: ["./**/generated.ts"],
    service: {
      name: "hasura-graphql",
      localSchemaFile: "./tooling/schema.graphql",
    },
  },
};
