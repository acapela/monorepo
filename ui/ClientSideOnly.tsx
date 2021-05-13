import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export function ClientSideOnly(props: Props) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(true);
  }, []);

  if (!shouldRender) return null;

  return <>{props.children}</>;
}
