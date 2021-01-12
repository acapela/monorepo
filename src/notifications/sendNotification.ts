import admin from "../firebase";
import { Firestore, DocumentSnapshot, DocumentData, QuerySnapshot } from "@google-cloud/firestore";

import { Thread, Room } from "./domain";
import { NotificationName } from "./UserNotification";
import Notifications, { Notification } from "./Notifications.domain";

/**
 * Function for fetching the pair of room and its agenda points.
 */

export async function roomRefsToDoc(
  roomRef: FirebaseFirestore.DocumentReference,
  agendaPointsRef: FirebaseFirestore.CollectionReference<DocumentData>
): Promise<Room> {
  const [roomDoc, agendaPointsSnapshot]: [
    DocumentSnapshot<DocumentData>,
    QuerySnapshot<DocumentData>
  ] = await Promise.all([roomRef.get(), agendaPointsRef.get()]);

  const agendaPoints: Array<Thread> = [];

  agendaPointsSnapshot.forEach((agendaPointDoc) => {
    agendaPoints.push({ ...(agendaPointDoc.data() as Thread), id: agendaPointDoc.id });
  });

  const Room: Room = {
    ...(roomDoc.data() as Room),
    id: roomDoc.id,
    agendaPoints: agendaPoints,
  };

  return Room;
}

/**
 * An endpoint that checks whether there are any notifications to be sent in a given room.
 * This endpoint is invoked programmatically by a cron job scheduled with Hasura.
 *
 * @param request - Hasura webhook with a message and list of notification names to process
 * @param response
 */

export async function sendNotifcations(
  namesOfNotificationsToProcess: Array<NotificationName>,
  roomId: string
): Promise<void> {
  const db: Firestore = admin.firestore();
  const NotificationsToProcess: Array<Notification> = Notifications.filter(
    (notification: Notification) => namesOfNotificationsToProcess.indexOf(notification.NOTIFICATION_NAME) > -1
  );

  // Fetch the room
  const roomRef: FirebaseFirestore.DocumentReference = db.collection("rooms").doc(roomId);
  const agendaPointsRef: FirebaseFirestore.CollectionReference<DocumentData> = roomRef.collection("agendaPoints");

  const room: Room = await roomRefsToDoc(roomRef, agendaPointsRef);

  for (const participant of room.participants) {
    for (const Notification of NotificationsToProcess) {
      const notification = new Notification(room, participant, roomRef);
      notification.process();
    }
  }
}
