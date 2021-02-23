export const GOOGLE_AUTH_SETTINGS = {
  clientId: "382181601047-j5c48g6en1lc5n2jadl8je8jrugcgf4r.apps.googleusercontent.com",
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  scope: "https://www.googleapis.com/auth/calendar.readonly",
};

export const GRAPHQL_SUBSCRIPTION_HOST =
  process.env.HASURA_HOST || (process.env.NODE_ENV === "production" ? "wss://backend.acape.la" : "ws://localhost:8080");

export const DEFAULT_REDIRECT_URL = "/home";
