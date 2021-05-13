import { Button } from "~ui/button";
import { useGetSpacesQuery } from "~frontend/gql/spaces";
import { ToolsBar } from "~frontend/ui/ToolsBar";

export function SpacesView() {
  const { data } = useGetSpacesQuery();

  return (
    <>
      <ToolsBar>
        <Button>Create new space</Button>
      </ToolsBar>
    </>
  );
}
