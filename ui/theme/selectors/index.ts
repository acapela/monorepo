import { Theme } from "../theme";
import { update, get as getByPath } from "lodash";
import { defaultTheme } from "../default";
import { getPaths } from "~shared/object";
import produce from "immer";

export interface StyledComponentsContextProps {
  theme: Theme<string>;
}

export type ContextualColorProvider = (props: StyledComponentsContextProps) => string;

/*
 * Creates a tree of theme property selectors. This will reduce the amount of code
 * used to access properties in our theme, and provide some cheap type support.
 *
 * Before:
 * const UIComponent = styled.div`
 *   background: ${props => props.theme.layout.background}; // theme is type `any`
 * `;
 *
 * After:
 * const UIComponent = styled.div`
 *   background: ${themeStyles.layout.background};
 * `;
 */
const _selectors: Theme<unknown> = produce(defaultTheme, (themeToUpdate: Theme<unknown>) => {
  getPaths(themeToUpdate).forEach((path) => {
    update(themeToUpdate, path, function Updater() {
      return (props: StyledComponentsContextProps) => getByPath(props.theme, path);
    });
  });
});

export const themeStyles: Theme<ContextualColorProvider> = _selectors as Theme<ContextualColorProvider>;
