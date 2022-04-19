import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { cachedComputed } from "@aca/clientdb";
import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";
import { commandMenuStore } from "@aca/desktop/domains/commandMenu/store";
import {
  getIsLastArrayElement,
  getLastElementFromArray,
  getNextItemInArray,
  getPreviousItemInArray,
} from "@aca/shared/array";
import { useFuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";
import { isNotNullish } from "@aca/shared/nullish";
import { FadePresenceAnimator, PopPresenceAnimator } from "@aca/ui/animations";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { IconSearch } from "@aca/ui/icons";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

import { CommandMenuActionsGroup } from "./CommandMenuActionsGroup";
import { groupActions } from "./groups";
import { CommandMenuSession } from "./session";
import { CommandMenuTargetLabel } from "./TargetLabel";

interface Props {
  session: CommandMenuSession;
  onActionSelected: (action: ActionData) => void;
}

const getActionSearchTerms = cachedComputed(function getActionSearchTerms(
  action: ActionData,
  actionContext: ActionContext
) {
  const { name, keywords = [], supplementaryLabel } = resolveActionData(action, actionContext);
  return [name, supplementaryLabel, ...keywords].filter(isNotNullish);
});

export const CommandMenuView = observer(function CommandMenuView({ session, onActionSelected }: Props) {
  const [activeAction, setActiveAction] = useState<ActionData | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const actionsScrollerRef = useRef<HTMLDivElement>(null);

  const { actionContext } = session;

  const actions = session.getActions(actionContext);

  const applicableActions = actions.filter((action) => {
    if (action.private) return false;
    if (!action.canApply(session.actionContext)) return false;

    return true;
  });

  const actionsToAlwaysShow = applicableActions.filter((action) => action.alwaysShowInSearch);

  const actionsToShow = useFuzzySearch(
    applicableActions,
    (action) => {
      return getActionSearchTerms(action, actionContext);
    },
    actionContext.searchKeyword
  );

  actionsToAlwaysShow.forEach((action) => {
    if (!actionsToShow.includes(action)) {
      actionsToShow.push(action);
    }
  });

  const [groupsToShow, flatGroupsActions] = groupActions(actionsToShow, actionContext);

  useEffect(() => {
    if (!activeAction) return;

    return activeAction.onMightBeSelected?.(session.actionContext);
  }, [activeAction]);

  useEffect(() => {
    actionsScrollerRef.current?.scrollTo({ top: 0, left: 0 });
    if (flatGroupsActions.length) {
      setActiveAction(flatGroupsActions[0]);
    } else {
      setActiveAction(null);
    }
  }, [actionContext.searchKeyword]);

  useShortcut(
    "ArrowDown",
    () => {
      if (!activeAction) {
        setActiveAction(flatGroupsActions[0] ?? null);
        return true;
      }

      if (getIsLastArrayElement(flatGroupsActions, activeAction)) return true;

      const nextAction = getNextItemInArray(flatGroupsActions, activeAction);

      if (!nextAction) return true;

      setActiveAction(nextAction);
    },
    { allowFocusedInput: true }
  );

  useShortcut(
    "ArrowUp",
    () => {
      if (!activeAction) {
        setActiveAction(getLastElementFromArray(flatGroupsActions));
        return true;
      }

      if (flatGroupsActions.indexOf(activeAction) === 0) return true;

      const prevAction = getPreviousItemInArray(flatGroupsActions, activeAction);

      if (!prevAction) return true;

      setActiveAction(prevAction);
      return true;
    },
    { allowFocusedInput: true }
  );

  useShortcut(
    "Enter",
    () => {
      if (activeAction) {
        onActionSelected(activeAction);
        return true;
      }
    },
    { allowFocusedInput: true }
  );

  useClickAway(
    bodyRef,
    action(() => {
      commandMenuStore.session = null;
    })
  );

  return (
    <BodyPortal>
      <UICover>
        <UIBody ref={bodyRef}>
          {!actionContext.hideTarget && (
            <UIHead>
              <CommandMenuTargetLabel session={session} />
            </UIHead>
          )}

          <UIInputHolder $hasKeyword={actionContext.searchKeyword.length > 0}>
            <IconSearch />
            <UIInput
              ref={inputRef}
              placeholder={actionContext.searchPlaceholder ?? "Find anything..."}
              autoFocus
              onChange={action((event) => {
                actionContext.searchKeyword = event.target.value;
              })}
              spellCheck={false}
              value={actionContext.searchKeyword}
              onFocus={(event) => {
                event.target.select();
              }}
            />
          </UIInputHolder>

          <UIActions ref={actionsScrollerRef}>
            {groupsToShow.map(({ groupItem, items: actions }) => {
              return (
                <CommandMenuActionsGroup
                  key={groupItem?.id ?? "no-group"}
                  group={groupItem}
                  actions={actions}
                  session={session}
                  activeAction={activeAction ?? undefined}
                  onSelectRequest={setActiveAction}
                  onApplyRequest={onActionSelected}
                />
              );
            })}
          </UIActions>
        </UIBody>
      </UICover>
    </BodyPortal>
  );
});

const UICover = styled(FadePresenceAnimator)`
  position: fixed;
  z-index: ${theme.zIndex.commandMenu};
  ${theme.common.stretchPosition};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 20vh;
  ${theme.colors.layout.background.opacity(0.7).asBg};
`;
const UIBody = styled(PopPresenceAnimator)`
  ${theme.colors.layout.actionPanel.asBg};
  max-width: 560px;
  max-height: 60vh;
  width: 100%;
  padding-top: 16px;
  ${theme.radius.panel};
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${theme.shadow.popoverPrimaryPanel};
`;

const UIInputHolder = styled.div<{ $hasKeyword: boolean }>`
  position: relative;
  margin-bottom: 15px;
  & > svg {
    position: absolute;
    left: 15px;
    top: 15px;
    transition: 0.2s all;
    opacity: ${(props) => (props.$hasKeyword ? 1 : 0.5)};

    ${theme.typo.pageTitle};
    top: 50%;
    transform: translateY(-50%);
    left: 24px;
  }
`;

const UIInput = styled.input`
  ${theme.common.transparentInput}
  width: 100%;
  ${theme.box.items.primarySelectItem.size.padding};
  ${theme.typo.pageTitle};

  padding-left: 60px;

  ::placeholder {
    color: inherit;
    opacity: 0.5;
  }
`;

const UIHead = styled.div`
  display: flex;
  &:empty {
    display: none;
  }

  padding: 8px 24px;
  margin-bottom: 8px;
`;

const UIActions = styled.div`
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 16px;

  &:empty {
    display: none;
  }
`;
