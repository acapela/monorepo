/**
 * This is our custom styled-components types definition.
 *
 * This is considerably trimmed down original version with a lot of features we don't really need removed in order to
 * considerably increase TSServer performance.
 *
 * Brief comparing shows that eg. auto imports and type checks are at least a few times faster with those optimizations.
 *
 * This types were created from @types/styled-components 4.0.3 (not latest) as a lot of performance issues were mentioned after
 * this version. I was not investigating exactly why.
 *
 * I updated 4.0.3 to eg. support functional components (not only class components). Beside I still trimmed it a lot (especially dynamic generics for theme
 * - replaced with theme-level, 'global' and static theme interface).
 *
 * For the most part, I tried to make it compatible with existing typings.
 *
 * I also cleaned it up a bit, improved internal naming while trying to understand the typings and simplified types where possible.
 *
 * I also added bunch of comments making it easier to follow.
 *
 * Note: we might try to release it to github, I imagine a lot of teams are struggling with that, so we can gain some stars and
 * traction for the product.
 *
 * Limitations:
 *
 * 1. There is no theme `generic` type. There is one 'global' `StyledTheme` type that can be modified and it is used
 * everywhere when you try to access the theme (I think it actually simplifies things a lot).
 *
 * It assumes that there is ever only one type of 'theme' which is use case in our app and probably use case in big majority
 * of any app.
 *
 * To modify the type of 'theme' do (in any file in the project)
 *
 * interface CustomTheme {
 *   foo: string
 * }
 *
 * declare module "styled-components" {
 *   export interface StyledTheme extends CustomTheme {
 *     someOtherProp?: string;
 *   }
 * }
 *
 * 2. `as` and `forwardedAs` prop will not modify types of the component.
 *
 * so for example
 *
 * const Div = styled.div<{}>``;
 *
 * <Div as="p" {...props} />
 *
 * even if we use as "p", the component still expects `div` props (and HTMLDivElement ref).
 *
 * Solution to this is using `withComponent`:
 *
 * const Div = styled.div<{}>``;
 * const P = Div.withComponent('p');
 *
 * const <P {...props} />
 *
 * `P` now has 'p' props and ref properly typed.
 *
 * 3. Props type is not inferred from passed functions arguments:
 *
 * eg.
 *
 * const foo = css`
 *   ${(props: Props) => props.foo} <-- TS error like `Props are not matching XYZ`
 * `
 *
 * in such case, use this instead
 *
 * const foo = css<Props>`
 *   ${(props) => props.foo} <-- TS error like `Props are not matching XYZ`
 * `
 *
 * It has to be explicit saying 'what props will we support inside callbacks' next to `css<HERE>`, but it seems to save
 * TS lots of work as well as it does not have to traverse all provided callbacks to 'pick' all props types and make sure
 * they're all compatible.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "styled-components" {
  import * as React from "react";

  /**
   * styled
   */

  // Built in tags eg. styled.div/p/strong etc.
  type BuiltInComponentName = keyof JSX.IntrinsicElements;
  type BuiltInComponentProps<Name extends BuiltInComponentName> = JSX.IntrinsicElements[Name];

  type BuiltInStyledComponentFactories = {
    [TagName in BuiltInComponentName]: StyledComponentCreator<BuiltInComponentProps<TagName>>;
  };

  export interface Styled extends BuiltInStyledComponentFactories {
    <P, TTag extends BuiltInComponentName>(tag: TTag): StyledComponentCreator<P & BuiltInComponentProps<TTag>>;
    <BaseProps, AddedProps>(component: StyledComponent<BaseProps, AddedProps>): StyledComponentCreator<
      BaseProps & AddedProps
    >;
    <P>(component: React.ComponentType<P>): StyledComponentCreator<P>;
  }

  const styled: Styled;
  export default styled;

  /**
   * Styled component eg Foo = styled.div<{}>``
   */

  export interface ThemeProps {
    theme?: StyledTheme;
  }

  type PropsWithTheme<P> = P & ThemeProps;

  export type StyledComponentBuiltInProps = ThemeProps & {
    as?: BuiltInComponentName;
    /**
     * Important note. We're using HTMLElement ref for any styled component, which is not fully correct!
     *
     *
     * eg styled.div`` has ref of HTMLElement, not HTMLDivElement.
     * it is not strict type-safeness, but saves a lot of generic lookups required to detect ref type:
     *
     * expensive examples:
     *
     * const Foo = styled.div``;
     * const Bar = styled(Foo)``; <-- has to 'capture' ref type from 'parent component', as argument for styled(argument) is very wide, it requires a lot of conditional types.
     *
     * further example:
     *
     * const Foo = forwardRef<HTMLDivElement, Props>(...);
     * const Bar = styled(Foo)``; <-- would have to check if passed component matched ForwardRefExoticComponent<Props> and then infer Props['ref'] and pick it (2 level conditional type check).
     *
     * And many other examples.
     *
     * For that reason I decided to simply use ref of `HTMLElement`, so code like this will be TS-correct:
     *
     * const Link = styled.a``;
     * const ref = useRef<HTMLDivElement>(null);
     *
     * <Link ref={ref} /> // <-- !!! this is incorrect, but TS will not complain
     *
     * Final note - I'm not sure if its a good way to go. If it bites us, we can make it somehow smart to support use cases we have.
     */
    //
    //
    ref?: React.Ref<HTMLElement>;
  };

  export type StyledComponentProps<P> = P & StyledComponentBuiltInProps;

  export type StyledComponent<BaseProps, AddedProps = {}> = React.ComponentType<
    StyledComponentProps<BaseProps & AddedProps>
  > & {
    withComponent<K extends BuiltInComponentName>(tag: K): StyledComponent<BuiltInComponentProps<K>, AddedProps>;
    withComponent<OtherComponentProps = {}>(
      element: React.ComponentType<OtherComponentProps>
    ): StyledComponent<OtherComponentProps, AddedProps>;
  };

  type AnyStyledComponent = StyledComponent<any, any>;

  /**
   * Styled component creator eg. styled.div
   */

  export interface StyledComponentCreator<P> {
    (strings: TemplateStringsArray, ...interpolations: Array<Interpolation<P>>): StyledComponent<P>;
    <U>(strings: TemplateStringsArray, ...interpolations: Array<Interpolation<P & U>>): StyledComponent<P & U>;
    attrs<U, A extends Partial<P & U> & { [others: string]: any } = {}>(
      attrs: Attrs<P & U, A>
    ): StyledComponentCreator<DiffBetween<A, P & U>>;
  }

  /**
   * css function
   */

  export interface CssFunction {
    (strings: TemplateStringsArray, ...interpolations: StaticInterpolation[]): InterpolationStaticValue[];
    <P>(strings: TemplateStringsArray, ...interpolations: Array<Interpolation<P>>): Array<InterpolationPart<P>>;
  }

  export const css: CssFunction;

  /**
   * Theme type.
   *
   * Note: extend this type to inform TS about theme details.
   */

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface StyledTheme {}

  /**
   * ThemeProvider and context
   */

  export const ThemeProvider: ThemeProviderComponent;

  export interface ThemeProviderProps {
    theme?: StyledTheme | ((theme: StyledTheme) => StyledTheme);
  }
  export type ThemeProviderComponent = React.ComponentType<ThemeProviderProps>;

  /**
   * Global styles (createGlobalStyle)
   */

  export type GlobalStyleComponent<P> = React.ComponentType<PropsWithTheme<P>>;

  export function createGlobalStyle<P = {}>(
    strings: TemplateStringsArray,
    ...interpolations: Array<Interpolation<P>>
  ): GlobalStyleComponent<P>;

  /**
   * Keyframes
   */

  export interface Keyframes {
    getName(): string;
  }

  export function keyframes(strings: TemplateStringsArray, ...interpolations: StaticInterpolation[]): Keyframes;

  /**
   * Server side utilities
   */

  interface StylesheetComponentProps {
    sheet: ServerStyleSheet;
  }

  interface StyleSheetManagerProps {
    sheet?: StyleSheet;
    target?: Node;
  }

  export class StyleSheetManager extends React.Component<StyleSheetManagerProps> {}

  export class ServerStyleSheet {
    collectStyles(tree: React.ReactNode): React.ReactElement<StylesheetComponentProps>;
    getStyleTags(): string;
    getStyleElement(): Array<React.ReactElement<{}>>;
    interleaveWithNodeStream(readableStream: NodeJS.ReadableStream): NodeJS.ReadableStream;
    instance: StyleSheet;
    seal(): void;
  }

  /**
   * Style definition parts and interpolations
   */

  // Interpolation is any value allowed inside ${<HERE>} in styled component definition
  export type Interpolation<P> =
    | InterpolationPart<P>
    | ReadonlyArray<InterpolationPart<P> | ReadonlyArray<InterpolationPart<P>>>;

  export type InterpolationPart<P> = InterpolationStaticValue | InterpolationFunction<P>;
  export type StylesPart = InterpolationPart<any> | InterpolationPart<any>[];
  export type InterpolationStaticValue =
    | string
    | number
    | FalseyValue
    | Keyframes
    | Record<string, unknown>
    | StyledComponentInterpolation;
  // Static interpolation is used in cases where no props are passed eg. css`definition with no functions inside`
  export type StaticInterpolation =
    | InterpolationStaticValue
    | ReadonlyArray<InterpolationStaticValue | ReadonlyArray<InterpolationStaticValue>>;

  // Styled component interpolation is for creating selectors using other styled components. eg styled.div<{}>`& ${OtherComponent} { color: red }`
  // We're doing some TS magic here to allow TS to distinguish functional styled components (technically functions) from functions inside style definition (and to infer the props if needed).
  type StyledComponentInterpolation = Pick<AnyStyledComponent, keyof AnyStyledComponent>;

  export type InterpolationFunction<P> = (props: PropsWithTheme<P>) => Interpolation<P>;

  /**
   * Utility functions
   */

  export function isStyledComponent(target: unknown): target is AnyStyledComponent;

  /**
   * .attrs types
   */

  type Attrs<P, A extends Partial<P>> = {
    [K in keyof A]: ((props: P) => A[K]) | A[K];
  };

  /**
   * Utility types
   */
  type FalseyValue = undefined | null | false;
  type Key = keyof any;
  type Diff<T extends Key, U extends Key> = ({ [P in T]: P } & { [P in U]: never })[T];
  type DiffBetween<T, U> = Pick<T, Diff<keyof T, keyof U>> & Pick<U, Diff<keyof U, keyof T>>;
}
