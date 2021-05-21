import { FlattenSimpleInterpolation } from "styled-components";

export function allowCssProp({ css }: { css?: FlattenSimpleInterpolation }) {
  return css;
}
