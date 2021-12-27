import { ComponentType, ReactNode } from "react";

const layoutSymbol = Symbol("page layout");
const layoutPropsSymbol = Symbol("page layout props");

export function assignPageLayout<PageProps, LayoutProps>(
  PageComponent: ComponentType<PageProps>,
  LayoutComponent: ComponentType<{ children: ReactNode } & LayoutProps>,
  defaultLayoutProps?: Partial<LayoutProps>
) {
  if (Reflect.get(PageComponent, layoutSymbol)) {
    console.warn(`PageComponent - ${PageComponent.displayName} already has LayoutComponent. Overwritting.`);
  }

  Reflect.set(PageComponent, layoutSymbol, LayoutComponent);
  Reflect.set(PageComponent, layoutPropsSymbol, defaultLayoutProps);
}

export function renderWithPageLayout<P>(PageComponent: ComponentType<P>, props: P) {
  const LayoutComponent = Reflect.get(PageComponent, layoutSymbol) as ComponentType | null;
  const layoutProps = Reflect.get(PageComponent, layoutPropsSymbol) as Record<string, unknown> | undefined;

  if (!LayoutComponent) {
    return <PageComponent {...props} />;
  }

  return (
    <LayoutComponent {...layoutProps}>
      <PageComponent {...props} />
    </LayoutComponent>
  );
}
