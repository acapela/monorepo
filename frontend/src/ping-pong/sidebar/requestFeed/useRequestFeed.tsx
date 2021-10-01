import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";

import { FeedSection } from "./types";

export const useRequestFeed = function (): FeedSection[] {
  // This is a mock to make it work
  const currentUser = useAssertCurrentUser();

  return [
    {
      key: "requires-attention",
      label: "Requires attention",
      items: [
        {
          id: "000",
          title: "Dashboard redesign",
          participants: [currentUser],
          subTitle: "1 Hour Ago",
          updateCount: 0,
        },
        {
          id: "001",
          title: "Onboarding designs",
          participants: [currentUser],
          subTitle: "6 Hours left",
          updateCount: 0,
        },
      ],
    },
    {
      key: "new",
      label: "New",
      items: [
        {
          id: "002",
          title: "Investor updates",
          participants: [currentUser],
          subTitle: "We should send out a new investor updates to all the ones that supported us in the first round",
          updateCount: 1,
        },
      ],
    },
    {
      key: "open",
      label: "Open",
      items: [
        {
          id: "003",
          title: "Desktop App Launch",
          participants: [currentUser],
          subTitle: "I just deployed version 2.4.5 of our new MacOS app to be reviewed in the app store. Does anyone",
          updateCount: 0,
        },
        {
          id: "004",
          title: "Friday Drinks",
          participants: [currentUser],
          subTitle: "2 Days Left",
          updateCount: 0,
        },
      ],
    },
    {
      key: "closed",
      label: "Closed",
      items: [
        {
          id: "005",
          title: "Brand announcement",
          participants: [currentUser],
          subTitle: "I would like some feedback on the blogpost I made yesterday. I included last weeks's info",
          updateCount: 0,
        },
      ],
    },
  ];
};
