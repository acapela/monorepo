import React from "react";
import styled from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { styledObserver } from "~shared/component";
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
export const TopicSummaryMessage = styledObserver<Props>((props) => {
  const { topic, className } = props;
  const { closedByUser, closed_at } = topic;

  if (!topic.isClosed) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const closedAtDate = new Date(closed_at!);

  return (
    <>
      {closedByUser && (
        <UIHolder className={className}>
          <UIHead>
            <UserAvatar user={closedByUser} size={20} />
            <div>Closed the request</div>
            <UISideTimeLabel date={closedAtDate} />
          </UIHead>
        </UIHolder>
      )}
      {!closedByUser && (
        <UIHolder className={className}>
          <UIHead>
            <UICheckCircle label={<IconAcapelaWave />} />
            <div>
              Hurray! <UIBold>{topic.name}</UIBold> has been completed by everyone and has been <UIBold>Closed</UIBold>.
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <UISideTimeLabel date={new Date(topic.closed_at!)} />
          </UIHead>
        </UIHolder>
      )}

      {!topic.isArchived && <TopicArchiveNotice {...props} />}

      {topic.isArchived && (
        <UIHolder className={className}>
          <UIHead>
            <UICheckCircle label={<IconAcapelaWave />} />
            <div>
              <UIBold>{topic.name}</UIBold> is archived.
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <UISideTimeLabel date={new Date(topic.archived_at!)} />
          </UIHead>
        </UIHolder>
      )}
    </>
  );
})``;

const TopicArchiveNotice = styledObserver<Props>(({ topic, className }: Props) => {
  function handleReopen() {
    topic.update({ closed_at: null, closed_by_user_id: null });
  }

  function handleArchive() {
    topic.update({ archived_at: new Date().toISOString() });
  }

  return (
    <UIHolder className={className}>
      <UIHead>
        <UICheckCircle label={<IconAcapelaWave />} />

        <div>
          <UIBold>{topic.name}</UIBold> will be{" "}
          <UIArchiveTooltip data-tooltip="Archived requests are available through the search bar">
            archived
          </UIArchiveTooltip>{" "}
          automatically in the next weekday. <br /> You could also{" "}
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
  padding: 20px 0;
`;

const UIHead = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap}
  ${theme.font.medium}
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.typo.content.secondary};
`;

const UICheckCircle = styled(CircleLabel)<{}>`
  height: 20px;
  width: 20px;
`;

const UIArchiveTooltip = styled.span<{}>`
  text-decoration: underline;
  cursor: default;
`;

const UIBold = styled.span<{}>`
  ${theme.font.black}
`;
