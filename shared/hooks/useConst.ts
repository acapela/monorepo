import { useState } from "react";

export function useConst<T>(factory: () => T): T {
  const [value] = useState(factory);

  return value;
}
