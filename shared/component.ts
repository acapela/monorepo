import { observer } from "mobx-react";
import { FunctionComponent } from "react";
import styled from "styled-components";

export function styledObserver<Props>(component: FunctionComponent<Props>) {
  return styled(observer(component));
}
