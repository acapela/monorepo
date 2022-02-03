import { BrowserView } from "electron";

type SiteFilter = { on: (url: URL) => boolean; rewriteURL?: (url: URL) => string; css?: string };

const isHostSlack = (url: URL) => url.hostname.endsWith(".slack.com");

const siteFilters: SiteFilter[] = [
  {
    on: (url) => isHostSlack(url),
    rewriteURL: (url) => url.toString().replace("/archives/", "/messages/"),
    css: `.p-workspace-layout {
            grid-template-columns: 100% !important;
            grid-template-areas: 'p-workspace__primary_view p-workspace__secondary_view' !important;  
          }
          .p-workspace__sidebar {
            display: none !important;
          }
          `,
  },
  {
    on: (url) => isHostSlack(url) && url.searchParams.has("thread_ts"),
    css: `.p-workspace-layout {
            grid-template-columns: auto 320px !important;
          }`,
  },
  {
    on: (url) => url.hostname.endsWith("notion.so"),
    css: `.notion-sidebar-container {
            display: none;
          }
          .notion-frame {
            width: 100% !important;
          }`,
  },
];

export async function loadURLWithFilters(browserView: BrowserView, url: string) {
  const applicableSiteFilters = siteFilters.filter((filter) => filter.on(new URL(url)));
  const filteredURL = applicableSiteFilters.reduce(
    (currentURL, filter) => filter.rewriteURL?.(new URL(currentURL)) ?? currentURL,
    url
  );
  await browserView.webContents.loadURL(filteredURL);
  await browserView.webContents.insertCSS(applicableSiteFilters.map((filter) => filter.css).join("\n"));
}
