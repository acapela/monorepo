import { observer } from "mobx-react";
import { ForwardRefRenderFunction, FunctionComponent } from "react";
import styled from "styled-components";

import { namedForwardRef } from "./react/namedForwardRef";

export function styledObserver<Props>(Component: FunctionComponent<Props>) {
  return styled(observer(Component));
}

export function styledForwardRef<Ref, Props>(Component: ForwardRefRenderFunction<Ref, Props>) {
  return styled(namedForwardRef(Component));
}
