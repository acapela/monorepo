import router from "next/router";
import { ReactNode } from "react";
import styled from "styled-components";

import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { routes } from "~shared/routes";
import { Button } from "~ui/buttons/Button";

interface Props {
  title?: ReactNode;
  description: ReactNode;
}

export function ErrorView({ title = "Something went wrong", description }: Props) {
  return (
    <FocusedActionLayout title={title} description={description}>
      <UIActions>
        <Button
          kind="primary"
          onClick={() => {
            router.push(routes.home);
          }}
        >
          Go back to homepage
        </Button>
      </UIActions>
    </FocusedActionLayout>
  );
}

const UIActions = styled.div`
  display: flex;
  justify-content: center;
`;
