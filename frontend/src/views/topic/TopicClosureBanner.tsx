import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar } from "~frontend/ui/users/Avatar";

interface Props {
  closedBy: UserBasicInfoFragment;
  closedAt: string;
}

// Example stamp: '2021-06-01T05:56:25.514'
function fromUtcTimestamp(stamp: string): string {
  const withoutMilliseconds = stamp.split(".")[0];

  const [dateUnits, timeUnits] = withoutMilliseconds.split("T");

  const [Y, M, D, h, m, s] = [...dateUnits.split("-"), ...timeUnits.split(":")].map((s) => Number.parseInt(s));

  const inEpoch = Date.UTC(Y, M, D, h, m, s);
  return new Date(inEpoch).toLocaleString();
}

export const TopicClosureBanner = ({ closedBy, closedAt }: Props) => {
  return (
    <UIBanner>
      <Avatar url={closedBy.avatar_url} />
      <UIClosingInfo>
        <UIClosedBy>{closedBy.name} has closed this topic</UIClosedBy>
        <UIClosedAt>{fromUtcTimestamp(closedAt)}</UIClosedAt>
      </UIClosingInfo>
    </UIBanner>
  );
};

const UIBanner = styled.div`
  padding-left: 20px;
  width: 100%;
  height: 80px;

  display: flex;
  align-items: center;

  border-radius: 20px;
  background-color: hsla(210, 19%, 95%, 1);
`;

const UIClosingInfo = styled.div`
  padding-left: 24px;
`;

const UIClosedBy = styled.div`
  padding-bottom: 8px;
`;

const UIClosedAt = styled.div`
  font-size: 0.8rem;
  color: hsla(210, 11%, 45%, 1);
`;
