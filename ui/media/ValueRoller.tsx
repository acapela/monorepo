import { ReactNode } from "react";
import { useListRoller } from "~shared/hooks/useListRoller";

interface RenderProps<T> {
  value: T;
  setNextValue: () => void;
}

interface Props<T> {
  possibleValues: T[];
  activeValue: T;
  onValueChange: (item: T) => void;
  children: (props: RenderProps<T>) => ReactNode;
}

export function ValueRoller<T>({ possibleValues, activeValue, onValueChange, children }: Props<T>) {
  const setNextValue = useListRoller({
    items: possibleValues,
    activeItem: activeValue,
    onActiveItemChange: onValueChange,
  });
  return <>{children({ setNextValue, value: activeValue })}</>;
}
