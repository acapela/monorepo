import { BrowserView } from "electron";
import { StylesPart, css } from "styled-components";

type SiteFilter = {
  on: (url: URL) => boolean;
  rewriteURL?: (url: URL) => string;
  css?: StylesPart;
};

const isHostSlack = (url: URL) => url.hostname.endsWith(".slack.com");

const siteFilters: SiteFilter[] = [
  {
    on: (url) => isHostSlack(url),
    rewriteURL: (url) => url.toString().replace("/archives/", "/messages/"),
    css: css`
      .p-client {
        grid-template-rows: auto min-content !important;
        grid-template-areas: "p-client__workspace" "p-client__banners" !important;
      }
      .p-top_nav {
        display: none !important;
      }
      .p-workspace-layout {
        grid-template-columns: 1fr fit-content(40%) !important;
        grid-template-areas: "p-workspace__primary_view p-workspace__secondary_view" !important;
      }
      .p-workspace__sidebar,
      .p-resizer {
        display: none !important;
      }
      .p-workspace__secondary_view {
        min-width: 400px !important;
      }
    `,
  },
  {
    on: (url) => isHostSlack(url) && url.searchParams.has("thread_ts"),
    css: css`
      .p-workspace-layout {
        grid-template-columns: auto 40% !important;
      }
    `,
  },
  {
    on: (url) => url.hostname.endsWith("notion.so"),
    css: css`
      .notion-sidebar-container {
        display: none;
      }
      .notion-frame {
        width: 100% !important;
      }
    `,
  },
];

function stylesToString(styles: StylesPart) {
  if (Array.isArray(styles)) {
    return styles.join("");
  }

  return `${styles}`;
}

const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36";

export async function loadURLWithFilters(browserView: BrowserView, url: string) {
  let parsedURL: URL;
  try {
    parsedURL = new URL(url);
  } catch (_) {
    throw new Error("Invalid URL: " + url);
  }
  const applicableSiteFilters = siteFilters.filter((filter) => filter.on(parsedURL));
  const filteredURL = applicableSiteFilters.reduce(
    (currentURL, filter) => filter.rewriteURL?.(new URL(currentURL)) ?? currentURL,
    url
  );

  const insertApplicableCss = async () =>
    browserView.webContents.insertCSS(applicableSiteFilters.map((filter) => stylesToString(filter.css)).join("\n"));
  await browserView.webContents.loadURL(filteredURL, { userAgent });
  await insertApplicableCss();

  browserView.webContents.on("did-navigate", insertApplicableCss);
}
