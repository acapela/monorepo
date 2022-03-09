import router from "next/router";
import { useEffect } from "react";

import { routes } from "@aca/shared/routes";

export default function Home() {
  useEffect(() => {
    router.push(routes.appDownload);
  });
  return <></>;
}
