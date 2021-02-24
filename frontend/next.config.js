const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  async rewrites() {
    const backendHost = getBackendHost();
    const hasuraHost = getHasuraHost();
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendHost}/api/:path*`,
      },
      {
        source: "/graphql",
        destination: `${hasuraHost}/v1/graphql`,
      },
    ];
  },
});

function getHasuraHost() {
  if (typeof process.env.HASURA_HOST === "string") {
    return process.env.HASURA_HOST;
  } else if (process.env.NODE_ENV !== "production") {
    return "http://localhost:8080";
  }
  return "https://backend.acape.la";
}

function getBackendHost() {
  if (typeof process.env.BACKEND_HOST === "string") {
    return process.env.BACKEND_HOST;
  } else if (process.env.NODE_ENV !== "production") {
    return "http://localhost:1337";
  }
  return "https://backend-dot-meetnomoreapp.appspot.com";
}
