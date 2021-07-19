import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  onClientRendered?: () => void;
}

export function ClientSideOnly(props: Props) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(true);
  }, []);

  useEffect(() => {
    if (shouldRender) {
      props.onClientRendered?.();
    }
  }, [shouldRender]);

  if (!shouldRender) return null;

  return <>{props.children}</>;
}
