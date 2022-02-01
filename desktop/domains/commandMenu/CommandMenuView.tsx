import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { getLastElementFromArray, getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { FadePresenceAnimator, PopPresenceAnimator } from "@aca/ui/animations";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

import { CommandMenuAction } from "./CommandMenuAction";
import { fuzzySearch } from "./search/fuzzySearch";
import { CommandMenuSession } from "./session";

interface Props {
  session: CommandMenuSession;
  onActionSelected: (action: ActionData) => void;
}

export const CommandMenuView = observer(function CommandMenuView({ session, onActionSelected }: Props) {
  const [keyword, setKeyword] = useState("");
  const [activeAction, setActiveAction] = useState<ActionData | null>(null);

  const actions = session.getActions({ keyword });

  const applicableActions = actions.filter((action) => {
    if (!action.canApply(session.actionContext)) return false;

    return true;
  });

  const actionsToShow = fuzzySearch(
    applicableActions,
    (action) => {
      const { name, keywords = [] } = resolveActionData(action);
      return [name, ...keywords];
    },
    keyword
  );

  useEffect(() => {
    if (actionsToShow.length) {
      setActiveAction(actionsToShow[0]);
    } else {
      setActiveAction(null);
    }
  }, [keyword]);

  useShortcut("ArrowDown", () => {
    if (!activeAction) {
      setActiveAction(actionsToShow[0] ?? null);
      return true;
    }

    const nextAction = getNextItemInArray(actionsToShow, activeAction);

    if (!nextAction) return true;

    setActiveAction(nextAction);
  });

  useShortcut("ArrowUp", () => {
    if (!activeAction) {
      setActiveAction(getLastElementFromArray(actionsToShow));
      return true;
    }

    const prevAction = getPreviousItemInArray(actionsToShow, activeAction);

    if (!prevAction) return;

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
          <UIInput
            placeholder="Search..."
            autoFocus
            onChange={(event) => {
              setKeyword(event.target.value);
            }}
            spellCheck={false}
          />
          <UIActions>
            {actionsToShow.map((action) => {
              return (
                <CommandMenuAction
                  key={action.id}
                  action={action}
                  session={session}
                  isActive={activeAction?.id === action.id}
                  onSelectRequest={() => {
                    setActiveAction(action);
                  }}
                  onApplyRequest={() => {
                    onActionSelected(action);
                  }}
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

  ::placeholder {
    color: inherit;
    opacity: 0.7;
  }
`;

const UIActions = styled.div`
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 16px;
`;
