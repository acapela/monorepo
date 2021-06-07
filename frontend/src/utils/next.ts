const NEXT_DATA_ID = "__NEXT_DATA__";

export function readAppInitialProps(): Record<string, unknown> {
  return readNextData()?.props;
}

export function readAppInitialPropByName<T = string>(name: string) {
  return readAppInitialProps()?.[name] as T;
}

export function readNextData() {
  if (typeof document === "undefined") return null;

  const dataScript = document.getElementById(NEXT_DATA_ID);

  if (!dataScript) return null;

  return JSON.parse(dataScript.innerHTML);
}
