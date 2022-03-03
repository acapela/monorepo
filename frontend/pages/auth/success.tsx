import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { PageMeta } from "@aca/frontend/utils/PageMeta";

export default function () {
  return (
    <>
      <PageMeta title="Authentication Complete Acapela" />
      <FocusedActionLayout
        title={`Authentication Complete Acapela`}
        description="We have successfully linked the app with Acapela."
        children={undefined}
      />
    </>
  );
}
