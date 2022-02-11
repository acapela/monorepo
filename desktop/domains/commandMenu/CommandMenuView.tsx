import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import {
  getIsLastArrayElement,
  getLastElementFromArray,
  getNextItemInArray,
  getPreviousItemInArray,
} from "@aca/shared/array";
import { fuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";
import { isNotNullish } from "@aca/shared/nullish";
import { FadePresenceAnimator, PopPresenceAnimator } from "@aca/ui/animations";
import { BodyPortal } from "@aca/ui/BodyPortal";
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

export const CommandMenuView = observer(function CommandMenuView({ session, onActionSelected }: Props) {
  const [activeAction, setActiveAction] = useState<ActionData | null>(null);
  const actionsScrollerRef = useRef<HTMLDivElement>(null);

  const { actionContext } = session;

  const actions = session.getActions(actionContext);

  const applicableActions = actions.filter((action) => {
    if (action.private) return false;
    if (!action.canApply(session.actionContext)) return false;

    return true;
  });

  const actionsToShow = fuzzySearch(
    applicableActions,
    (action) => {
      const { name, keywords = [] } = resolveActionData(action, actionContext);
      return [name, ...keywords].filter(isNotNullish);
    },
    actionContext.searchKeyword
  );

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

  useShortcut("ArrowDown", () => {
    if (!activeAction) {
      setActiveAction(flatGroupsActions[0] ?? null);
      return true;
    }

    if (getIsLastArrayElement(flatGroupsActions, activeAction)) return true;

    const nextAction = getNextItemInArray(flatGroupsActions, activeAction);

    if (!nextAction) return true;

    setActiveAction(nextAction);
  });

  useShortcut("ArrowUp", () => {
    if (!activeAction) {
      setActiveAction(getLastElementFromArray(flatGroupsActions));
      return true;
    }

    if (flatGroupsActions.indexOf(activeAction) === 0) return true;

    const prevAction = getPreviousItemInArray(flatGroupsActions, activeAction);

    if (!prevAction) return true;

    setActiveAction(prevAction);
    return true;
  });

  useShortcut("Enter", () => {
    if (activeAction) {
      onActionSelected(activeAction);
    }
  });

  return (
    <BodyPortal>
      <UICover>
        <UIBody>
          <UIHead>
            <CommandMenuTargetLabel session={session} />
          </UIHead>

          <UIInput
            placeholder={actionContext.searchPlaceholder ?? "Find anything..."}
            autoFocus
            onChange={action((event) => {
              actionContext.searchKeyword = event.target.value;
            })}
            spellCheck={false}
            value={actionContext.searchKeyword}
          />
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
  z-index: 3;
  ${theme.common.stretchPosition};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 20vh;
  ${theme.colors.layout.background.opacity(0.5).asBg}
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
`;
const UIInput = styled.input`
  ${theme.typo.pageTitle};
  background: none;
  color: inherit;
  border: none;
  outline: none;
  width: 100%;
  padding: 8px 24px;
  margin-bottom: 16px;

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
`;
