import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function () {
  useEffect(() => {
    signIn("atlassian");
  });
  return <></>;
}
