import { FlattenInterpolation, InterpolationValue, InterpolationFunction } from "styled-components";

declare module "styled-components" {
  export type FlattenSimpleInterpolation = FlattenInterpolation<any> | FlattenInterpolation<any>[];
}
