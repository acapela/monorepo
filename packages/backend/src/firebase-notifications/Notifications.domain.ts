import InviteNotification from "./InviteNotification";
import RoomExpiredNotification from "./RoomExpiredNotification";
import RoomUncheckedNotification from "./RoomUncheckedNotification";
import UnseenMessagesNotification from "./UnseenMessagesNotification";

export type Notification =
  | typeof InviteNotification
  | typeof RoomExpiredNotification
  | typeof RoomUncheckedNotification
  | typeof UnseenMessagesNotification;

export default [InviteNotification, RoomExpiredNotification, RoomUncheckedNotification, UnseenMessagesNotification];
