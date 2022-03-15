import { observer } from "mobx-react";
import { ForwardRefRenderFunction, FunctionComponent, forwardRef } from "react";
import styled from "styled-components";

import { namedForwardRef } from "./react/namedForwardRef";

export function styledObserver<Props>(Component: FunctionComponent<Props>) {
  return styled(observer(Component));
}

export function styledObserverForwardRef<T, Props>(Component: ForwardRefRenderFunction<T, Props>) {
  return styled(observer(forwardRef(Component)));
}

export function styledForwardRef<Ref, Props>(Component: ForwardRefRenderFunction<Ref, Props>) {
  return styled(namedForwardRef(Component));
}
