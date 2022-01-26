import { useLayoutEffect } from "react";

import { desktopRouter } from ".";

interface Props {
  to: string;
}

export function Redirect({ to }: Props) {
  const { url } = desktopRouter.useLocation();

  useLayoutEffect(() => {
    if (to !== url) {
      desktopRouter.unsafeReplace(to);
    }
  }, []);

  return null;
}
