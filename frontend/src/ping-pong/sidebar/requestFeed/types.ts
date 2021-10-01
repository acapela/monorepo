import { UserAvatar_UserFragment } from "~gql";

export interface FeedItem {
  id: string;
  participants: UserAvatar_UserFragment[];
  title: string;
  subTitle: string;
  updateCount: number;
}

export interface FeedSection {
  key: string;
  label: string;
  items: FeedItem[];
}
