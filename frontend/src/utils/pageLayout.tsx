import { ComponentType, ReactNode } from "react";

const layoutSymbol = Symbol("page layout");

export function assignPageLayout(
  PageComponent: ComponentType,
  LayoutComponent: ComponentType<{ children: ReactNode }>
) {
  if (Reflect.get(PageComponent, layoutSymbol)) {
    console.warn(`PageComponent - ${PageComponent.displayName} already has LayoutComponent. Overwritting.`);
  }

  Reflect.set(PageComponent, layoutSymbol, LayoutComponent);
}

export function renderWithPageLayout<P>(PageComponent: ComponentType<P>, props: P) {
  const LayoutComponent = Reflect.get(PageComponent, layoutSymbol) as ComponentType | null;

  if (!LayoutComponent) {
    return <PageComponent {...props} />;
  }

  return (
    <LayoutComponent>
      <PageComponent {...props} />
    </LayoutComponent>
  );
}
