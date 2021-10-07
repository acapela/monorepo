export function openInNewTab(href: string) {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: href,
  }).click();
}
