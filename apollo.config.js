module.exports = {
  client: {
    includes: ["./**/*.{ts,tsx}"],
    excludes: ["./gql/generated.ts"],
    service: {
      name: "hasura-graphql",
      localSchemaFile: "./gql/schema.graphql",
    },
  },
};
