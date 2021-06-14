module.exports = {
  client: {
    includes: ["./**/*.{ts,tsx}"],
    excludes: ["./gql/generated.ts"],
    service: {
      name: "hasura-graphql",
      localSchemaFile: "./tooling/schema.graphql",
    },
  },
};
