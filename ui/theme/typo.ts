import { font } from "./utils/font";

const bodyBase = font().family("SF Pro Display");
const headerBase = font().family("Spezia Extended").headerLineHeight;

const body = bodyBase.readingLineHeight;

export const typo = {
  hero: headerBase.size(36).bold,
  pageTitle: headerBase.size(36),
  pageSubtitle: headerBase.size(24),
  body: body.size(14),
  bodyTitle: body.size(14).medium,
  note: body.size(12),
  noteTitle: body.size(12).semibold,
};
