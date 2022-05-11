export function watchIsBrowserDarkModeEnabled(onChange: (isDark: boolean) => void) {
  const darkModeMatcher = window.matchMedia("(prefers-color-scheme: dark)");

  onChange(darkModeMatcher.matches);

  function handleMatcherChange(event: MediaQueryListEvent) {
    onChange(event.matches);
  }

  darkModeMatcher.addEventListener("change", handleMatcherChange);

  return () => {
    darkModeMatcher.removeEventListener("change", handleMatcherChange);
  };
}

export function getIsBrowserDarkModeEnabled() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
