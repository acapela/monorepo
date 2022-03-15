import { signIn } from "next-auth/react";
import React, { useEffect } from "react";

export default function () {
  useEffect(() => {
    signIn("atlassian");
  });
  return <></>;
}
