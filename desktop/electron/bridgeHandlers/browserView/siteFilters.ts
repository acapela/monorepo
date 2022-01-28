import { BrowserView } from "electron";

type SiteFilter = { on: (url: URL) => boolean; rewriteURL?: (url: URL) => string; css?: string };
const siteFilters: SiteFilter[] = [
  {
    on: (url) => url.hostname.endsWith(".slack.com"),
    rewriteURL: (url) => url.toString().replace("/archives/", "/messages/"),
    css: `.p-workspace-layout {
            position: relative;
            left: -210px;
            width: calc(100% + 210px);
        }
        
        .p-workspace__sidebar, .p-resizer {
            display: none;
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
