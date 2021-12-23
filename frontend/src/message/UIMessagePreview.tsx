import styled from "styled-components";

export const UIMessagePreview = styled.div<{ $maxLines: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${(props) => props.$maxLines};
  line-clamp: ${(props) => props.$maxLines};
  overflow: hidden;
`;
