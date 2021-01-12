import "../../testSupport/testFirebase";
import "../../testSupport/testSendgrid";

import RoomUnchecked from "../RoomUncheckedNotification";
import { Room, Participant, Thread } from "../domain";
import { Timestamp, DocumentData, DocumentReference } from "@google-cloud/firestore";

describe("RoomUncheckedNotification", () => {
  test("is sent if there is an unchecked thread.", () => {
    const roomUncheckedNotifcationMock = new RoomUnchecked(
      roomMock,
      participant,
      (roomRefMock as unknown) as DocumentReference<DocumentData>
    );
    expect(roomUncheckedNotifcationMock.process()).toBe(true);
  });

  test("is not released if there is an unchecked thread that has unread messages.", () => {
    const unreadThreads: Array<Thread> = [
      {
        ...roomMock.agendaPoints[0],
        lastSeenMessage: {
          [participant.userId]: 1,
        },
      },
    ];

    const roomMockUnread: Room = {
      ...roomMock,
      agendaPoints: unreadThreads,
    };

    const roomUncheckedNotifcationMock = new RoomUnchecked(
      roomMockUnread,
      participant,
      (roomRefMock as unknown) as DocumentReference<DocumentData>
    );
    expect(roomUncheckedNotifcationMock.process()).toBe(false);
  });

  test("is not released if there is an unchecked thread but it is expired.", () => {
    const roomMockExpired: Room = {
      ...roomMock,
      deadline: new Timestamp(Math.floor(Date.now() / 1000) - 3600, 0), // some date from the past
    };

    const roomUncheckedNotifcationMock = new RoomUnchecked(
      roomMockExpired,
      participant,
      (roomRefMock as unknown) as DocumentReference<DocumentData>
    );
    expect(roomUncheckedNotifcationMock.process()).toBe(false);
  });
});

const participant: Participant = {
  userId: "someOtherTestUserId",
  email: "test@example.com",
  name: "Test User 1",
  notificationsStatus: {},
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
      lastSeenMessage: {
        [participant.userId]: 2,
      },
      lastRemindedMessage: {
        [participant.userId]: 2,
      },
      title: "Test agenda point",
      timeCreated: new Timestamp(1608120000, 0),
    },
  ],
  title: "Test Room Title",
  participants: [participant],
};

const roomRefMock = {
  update: () => {
    return;
  },
};
