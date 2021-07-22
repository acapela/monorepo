import { ContextualColorProvider, StyledComponentsContextProps, themeStyles } from ".";
import { Variant, VariantStates, InteractiveProps } from "../theme";
import { defaults, cloneDeep } from "lodash";
import produce from "immer";
import { css, FlattenInterpolation, ThemeProps } from "styled-components";

type CssColorProvider = FlattenInterpolation<ThemeProps<StyledComponentsContextProps>>;
type ContextualActionState = VariantStates<ContextualColorProvider>;
type CssActionState = VariantStates<CssColorProvider>;

/*
 * Our action states try to keep DRY and don't include colors already included in the default state.
 * This function includes all of these defaults so that the clients of this selector doesn't need to
 *
 * # Before
 * {
 *   default: {
 *     background: colors.BASE_GREY_6,
 *     text: colors.BASE_GREY_1,
 *     icon: colors.PRIMARY_PINK_1,
 *   },
 *   hover: {
 *     background: colors.BASE_GREY_4,
 *   },
 *   disabled: {
 *     icon: colors.BASE_GREY_4,
 *     text: colors.BASE_GREY_4,
 *     background: setColorOpacity(colors.BASE_GREY_7, 0.5),
 *   }
 * }
 *
 * # After
 * {
 *   default: {
 *     background: colors.BASE_GREY_6,
 *     text: colors.BASE_GREY_1,
 *     icon: colors.PRIMARY_PINK_1,
 *   },
 *   hover: {
 *     background: colors.BASE_GREY_4,
 *     text: colors.BASE_GREY_1,        // <---- This is added from default
 *     icon: colors.PRIMARY_PINK_1,     // <---- This is added from default
 *   },
 *   disabled: {
 *     icon: colors.BASE_GREY_4,
 *     text: colors.BASE_GREY_4,
 *     background: setColorOpacity(colors.BASE_GREY_7, 0.5),
 *   }
 * }
 *
 * ** Note: The above example used strings for simplicity sake, but this will actually return a styled components
 * selector for that value
 * {
 *   default: {
 *     ...
 *     text: ${props => props.them.interactive.primary.default.text}
 *     ...
 *   },
 *   hover: {
 *     ...
 *     text: ${props => props.them.interactive.primary.default.text}
 *     ...
 *   }
 *   ...
 * }
 *
 */
function withDefaults(actionState: ContextualActionState): ContextualActionState {
  return produce(actionState, (draft: ContextualActionState) => {
    (Object.keys(draft) as Array<keyof typeof draft>)
      .filter((key) => key !== "default")
      .forEach((key) => {
        defaults(draft[key], draft.default);
      });
  });
}

/*
 * For the vas majority of our use cases the theme action props will relate to a specific css property
 * This function matches the interactive action property to a specific css property
 */
function withCss(actionState: ContextualActionState): CssActionState {
  const cssActionState = cloneDeep(actionState) as VariantStates<unknown>;

  Object.values(cssActionState).forEach((actionProps: InteractiveProps<unknown>) => {
    actionProps.background = css`
      background: ${actionProps.background as ContextualColorProvider};
    ` as CssColorProvider;

    actionProps.text = css`
      color: ${actionProps.text as ContextualColorProvider};
    ` as CssColorProvider;

    actionProps.icon = css`
      color: ${actionProps.icon as ContextualColorProvider};
    ` as CssColorProvider;
  });
  return cssActionState as CssActionState;
}

export function getByAction(action: Variant): ContextualActionState {
  return withDefaults(themeStyles.interactive.actions[action]);
}

export function getCssByAction(action: Variant): CssActionState {
  return withCss(withDefaults(themeStyles.interactive.actions[action]));
}
