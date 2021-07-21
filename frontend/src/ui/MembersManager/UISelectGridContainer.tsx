import styled from "styled-components";
import { BASE_GREY_5 } from "~ui/colors";

export const UISelectGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  padding: 8px;
  border: 1px solid ${BASE_GREY_5};
  border-radius: 8px;
`;
