import "../../testSupport/testFirebase";
import "../../testSupport/testSendgrid";

import { Room, Participant } from "../domain";
import { Timestamp, DocumentData, DocumentReference } from "@google-cloud/firestore";
import UnseenMessagesNotification from "../UnseenMessagesNotification";

describe("UnseenNotification", () => {
  test("is released if there is an unseen message.", () => {
    const unseenNotificationMock = new UnseenMessagesNotification(
      roomMock,
      participant,
      (roomRefMock as unknown) as DocumentReference<DocumentData>
    );

    expect(unseenNotificationMock.process()).toBe(true);
  });
});

const participant: Participant = {
  userId: "someOtherTestUserId",
  email: "test@example.com",
  name: "Test User 1",
  notificationsStatus: {
    UnseenMessages: {
      timeSent: new Timestamp(Math.floor(Date.now() / 1000) - 3600, 0),
      notificationData: {
        "123": 0,
      },
    },
  },
};

const roomRefMock = {
  update: () => {
    return;
  },
};

const roomMock: Room = {
  // expired room
  id: "12345",
  authorId: "testUserId",
  deadline: new Timestamp(
    Math.floor(Date.now() / 1000) + 3600, // one hour from now
    0
  ),
  agendaPoints: [
    {
      id: "123",
      checkedUsers: [],
      howls: [
        {
          text: "test message",
          author: "yetAnotherUser",
          timeSent: new Timestamp(1608120000, 0),
        },
        {
          text: "test message 2",
          author: "yetAnotherUser",
          timeSent: new Timestamp(1608120001, 0),
        },
      ],
      lastRemindedMessage: {
        [participant.userId]: 0,
      },
      lastSeenMessage: {
        [participant.userId]: 0,
      },
      title: "Test agenda point",
      timeCreated: new Timestamp(1608120000, 0),
    },
  ],
  title: "Test Room Title",
  participants: [participant],
};
