import { signIn } from "next-auth/react";
import React, { useEffect } from "react";

export default function () {
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const provider = searchParams.get("provider");
    const scope = searchParams.get("scope");
    if (provider) {
      signIn(provider, undefined, scope ? { scope } : undefined);
    } else {
      throw new Error(`Missing provider`);
    }
  });
  return <></>;
}
