import React from "react";

interface Props {
  notificationId: string;
}

export function NotificationView({ notificationId }: Props) {
  return <>Notification id: {notificationId}</>;
}
