import { getLocation } from "@swan-io/chicane";
import React, { useEffect } from "react";

import { FocusedActionLayout } from "../layouts/FocusedActionLayout/FocusedActionLayout";

export function StripeCheckedOut() {
  const { search } = getLocation();
  useEffect(() => {
    location.href = "acapela://settings/subscription";
  });
  const isSuccess = search.reason == "success";
  return (
    <FocusedActionLayout
      title={isSuccess ? "Checkout complete" : "Checkout aborted"}
      description="You can close this tab now."
    >
      <></>
    </FocusedActionLayout>
  );
}
