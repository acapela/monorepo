import React, { useEffect } from "react";

import { Router } from "@aca/frontend/src/router";

export default function Home() {
  useEffect(() => {
    Router.push("appDownload");
  });
  return <></>;
}
