import { differenceInHours } from "date-fns";
import { addBusinessDays } from "date-fns/esm";
import React from "react";
import styled from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { styledObserver } from "~shared/component";
import { relativeFormatDate } from "~shared/dates/format";
import { TextButton } from "~ui/buttons/TextButton";
import { IconAcapelaWave } from "~ui/icons";
import { CircleLabel } from "~ui/icons/CircleLabel";
import { theme } from "~ui/theme";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

type Props = {
  topic: TopicEntity;
  className?: string;
};

const TextAction = (props: Omit<React.ComponentProps<typeof TextButton>, "kind" | "inline">) => (
  <TextButton {...props} kind="primary" inline />
);

// Temporary, to be deleted
// Parts of this will be copied over to make the event system work
export const TopicClosureMessage = styledObserver<Props>((props) => {
  const { topic } = props;

  if (!topic.isClosed) {
    return null;
  }

  return <>{!topic.isArchived && <TopicArchiveNotice {...props} />}</>;
})``;

const TopicArchiveNotice = styledObserver<Props>(({ topic, className }: Props) => {
  function handleReopen() {
    topic.update({ closed_at: null, closed_by_user_id: null });
  }

  function handleArchive() {
    topic.update({ archived_at: new Date().toISOString() });
  }

  function getTimeOfArchiveLabel() {
    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const closedDate = new Date(topic.closed_at!);
    const timeOfArchive = addBusinessDays(closedDate, 1);

    const hoursUntilArchive = differenceInHours(timeOfArchive, now);

    // If an old topic has been un-archived or approaching hour of archive
    if (hoursUntilArchive <= 1) {
      return "soon";
    }

    return relativeFormatDate(timeOfArchive);
  }

  return (
    <UIHolder className={className}>
      <UIHead>
        <UIAcapelaCircle label={<IconAcapelaWave />} />

        <div>
          <UIBold>{topic.name}</UIBold> will be{" "}
          <UIArchiveTooltip data-tooltip="Archived requests are available through the search bar">
            archived
          </UIArchiveTooltip>{" "}
          automatically {getTimeOfArchiveLabel()}. <br /> You could also{" "}
          <TextAction onClick={handleReopen}>Reopen</TextAction> or{" "}
          <TextAction onClick={handleArchive}>Archive now</TextAction>.
        </div>

        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <UISideTimeLabel date={new Date(topic.closed_at!)} />
      </UIHead>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  padding-top: 20px;
`;

const UIHead = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.content.secondary};
`;

const UIAcapelaCircle = styled(CircleLabel)<{}>`
  height: 20px;
  width: 20px;
`;

const UIArchiveTooltip = styled.span<{}>`
  text-decoration: underline;
  cursor: default;
`;

const UIBold = styled.span<{}>`
  ${theme.font.semibold}
`;
