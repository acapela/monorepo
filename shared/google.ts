const wrapScope = (scopeName: string) => `https://www.googleapis.com/auth/${scopeName}`;

const BASE_SCOPES = ["userinfo.profile", "userinfo.email"];

export const GOOGLE_AUTH_SCOPES = BASE_SCOPES.map(wrapScope).join(" ");

export const GMAIL_SCOPE = "gmail.readonly";
export const GOOGLE_AUTH_WITH_GMAIL_SCOPES = [...BASE_SCOPES, GMAIL_SCOPE].map(wrapScope).join(" ");

export const isGmailIncludedInPlain = (value?: string) => value === "business";
