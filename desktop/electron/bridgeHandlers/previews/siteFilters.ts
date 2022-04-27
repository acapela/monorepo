import { BrowserView } from "electron";
import { StylesPart, css } from "styled-components";

import { createCleanupObject } from "@aca/shared/cleanup";

import { onElementAdded, onElementHidden, onElementRemoved } from "./elementObservers";
import { markFullPageLoadTime, markHtmlPageLoadTime } from "./instrumentation";

type SiteFilter = {
  on: (url: URL) => boolean;
  rewriteURL?: (url: URL) => string;
  css?: StylesPart;
  onLoad?: (browserView: BrowserView) => void;
};

const isHostSlack = (url: URL) => url.hostname.endsWith(".slack.com");

const isSlackComposeURL = (url: URL) => {
  const pathParts = url.pathname.split("/");
  return isHostSlack(url) && pathParts[3] == "composer" && pathParts[4] == "draft";
};

const SlackComposeOpenFilter: SiteFilter = {
  on: isSlackComposeURL,
  onLoad: (browserView) => {
    browserView.webContents.once("did-finish-load", () => {
      browserView.webContents.executeJavaScript("document.querySelector('[data-qa=\"composer_button\"]')?.click()");
    });
  },
};

const siteFilters: SiteFilter[] = [
  {
    on: (url) => !isSlackComposeURL(url) && isHostSlack(url),
    onLoad: (browserView) =>
      onElementRemoved(
        browserView.webContents,
        () => markFullPageLoadTime(browserView),
        ".p-bookmarks_bar__placeholder_holder"
      ),
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
    on: (url) => !isSlackComposeURL(url) && isHostSlack(url) && url.searchParams.has("thread_ts"),
    onLoad: (browserView) =>
      onElementRemoved(
        browserView.webContents,
        () => markFullPageLoadTime(browserView),
        ".p-bookmarks_bar__placeholder_holder"
      ),
    css: css`
      .p-workspace-layout {
        grid-template-columns: auto 40% !important;
      }
    `,
  },
  SlackComposeOpenFilter,
  {
    on: (url) => url.hostname.endsWith("notion.so"),
    onLoad: (browserView) =>
      onElementAdded(browserView.webContents, () => markFullPageLoadTime(browserView), ".whenContentEditable"),
    css: css`
      .notion-sidebar-container {
        display: none;
      }
      .notion-frame {
        width: 100% !important;
      }
    `,
  },
  {
    on: (url) => url.hostname.endsWith("figma.com"),
    onLoad: (browserView) =>
      onElementRemoved(
        browserView.webContents,
        () => markFullPageLoadTime(browserView),
        '[class^="progress_bar--outer"]'
      ),
  },
  {
    on: (url) => url.hostname.endsWith("linear.app"),
    onLoad: (browserView) =>
      onElementHidden(browserView.webContents, () => markFullPageLoadTime(browserView), "#loading"),
  },
  {
    on: (url) => url.hostname.endsWith("atlassian.net"),
    onLoad: (browserView) =>
      onElementAdded(
        browserView.webContents,
        () => markFullPageLoadTime(browserView),
        '[data-test-id="issue.activity.comment"]'
      ),
  },
  {
    on: (url) => url.hostname.endsWith("github.com"),
    onLoad: (browserView) => () => markFullPageLoadTime(browserView), // github is 95% ssr
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

  const cleanup = createCleanupObject();

  function handleOnPageContentsLoaded() {
    markHtmlPageLoadTime(browserView);
    for (const filter of applicableSiteFilters) {
      cleanup.next = filter.onLoad?.(browserView);
    }
  }

  browserView.webContents.on("did-finish-load", handleOnPageContentsLoaded);

  const insertApplicableCss = async () =>
    browserView.webContents.insertCSS(applicableSiteFilters.map((filter) => stylesToString(filter.css)).join("\n"));
  try {
    await browserView.webContents.loadURL(filteredURL, { userAgent });
  } catch (e) {
    // Loading aborts when some SAP change the history before loading completes
    // the error is harmless, but must be caught or else all execution stops
    // https://github.com/electron/electron/issues/17526
    if ((e as { code: string })?.code !== "ERR_ABORTED") {
      throw e;
    }
  }
  await insertApplicableCss();

  browserView.webContents.on("did-navigate", insertApplicableCss);

  return function cleanupUrlLoading() {
    browserView.webContents.off("did-finish-load", handleOnPageContentsLoaded);
    browserView.webContents.off("did-navigate", insertApplicableCss);
    cleanup.clean();
  };
}
