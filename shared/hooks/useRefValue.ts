import { RefObject, useEffect, useState } from "react";

export function useRefValue<T>(ref: RefObject<T>) {
  const [state, setState] = useState(ref.current);

  useEffect(() => {
    setState(ref.current);
  }, [ref.current]);

  return state;
}
