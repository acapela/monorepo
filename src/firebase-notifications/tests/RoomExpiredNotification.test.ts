import "../../testSupport/testFirebase";
import "../../testSupport/testSendgrid";

import RoomExpiredNotification from "../RoomExpiredNotification";
import { Room, Participant } from "../domain";
import { Timestamp, DocumentReference, DocumentData } from "@google-cloud/firestore";

describe("RoomExpiredNotification", () => {
  test("is released if the date is from the past.", () => {
    const expiredNotifcationMock = new RoomExpiredNotification(
      roomMockFromPast,
      participant,
      {} as DocumentReference<DocumentData>
    );
    expect(expiredNotifcationMock.process()).toBe(true);
  });

  test("is not released if the date is from the future.", () => {
    const roomMockFromFuture = {
      ...roomMockFromPast,
      deadline: new Timestamp(Math.floor(Date.now() / 1000) + 3600, 0),
    };

    const expiredNotifcationMock = new RoomExpiredNotification(
      roomMockFromFuture,
      participant,
      {} as DocumentReference<DocumentData>
    );
    expect(expiredNotifcationMock.process()).toBe(false);
  });

  test("is not released if the considered used is not the author.", () => {
    const otherParticipant: Participant = {
      ...participant,
      userId: "somethingDifferent",
    };
    const expiredNotifcationMock = new RoomExpiredNotification(
      roomMockFromPast,
      otherParticipant,
      {} as DocumentReference<DocumentData>
    );
    expect(expiredNotifcationMock.process()).toBe(false);
  });
});

const participant: Participant = {
  userId: "testUserId",
  email: "test@example.com",
  name: "Test User",
  notificationsStatus: {},
};

const roomMockFromPast: Room = {
  // expired room
  id: "12345",
  authorId: "testUserId",
  deadline: new Timestamp(1608120000, 0),
  agendaPoints: [],
  title: "Test Room Title",
  participants: [participant],
};
