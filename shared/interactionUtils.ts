export function makeElementVisible(element?: HTMLElement | null) {
  element?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
}
