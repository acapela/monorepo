import { observer } from "mobx-react";
import React from "react";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationListEntity, notificationListEntity } from "@aca/desktop/clientdb/list";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SettingsList } from "@aca/desktop/ui/settings/SettingsList";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";
import { Toggle } from "@aca/ui/toggle";

export const NotificationsSettings = observer(function ThemeSelector() {
  const settings = applicationWideSettingsBridge.get();

  const allLists = getDb().entity(notificationListEntity);

  return (
    <SettingsList>
      <SettingRow
        title="Enable desktop notifications"
        description="In each created list you can decide if and how often you'd like to be notified about new notifications"
      >
        <Toggle
          size="small"
          isDisabled
          isSet={settings.enableDesktopNotifications}
          onChange={(isEnabled) => {
            applicationWideSettingsBridge.update({ enableDesktopNotifications: isEnabled });
          }}
        />
      </SettingRow>
      <SettingRow
        title="Show notifications count badge"
        description="Show number of unresolved notifications next to Acapela app icon"
      >
        <Toggle
          size="small"
          isDisabled
          isSet={settings.showNotificationsCountBadge}
          onChange={(isEnabled) => {
            applicationWideSettingsBridge.update({ showNotificationsCountBadge: isEnabled });
          }}
        />
      </SettingRow>
      {settings.showNotificationsCountBadge && (
        <>
          <SettingRow
            title="Only count unread notifications for count badge"
            description="Shows number of unread notifications that have not been resolved yet"
          >
            <Toggle
              size="small"
              isDisabled
              isSet={settings.showUnreadNotificationsCountBadge}
              onChange={(isEnabled) => {
                applicationWideSettingsBridge.update({ showUnreadNotificationsCountBadge: isEnabled });
              }}
            />
          </SettingRow>
          <SettingRow
            title="Lists to count notifications for count badge"
            description="Select lists from which to count notifications to show next to Acapela app icon"
          >
            <MultipleOptionsDropdown<NotificationListEntity>
              items={allLists.all}
              keyGetter={(l) => l.id}
              labelGetter={(l) => l.title}
              selectedItems={allLists.all.filter((l) => settings.notificationsCountBadgeListIds.includes(l.id))}
              placeholder="All lists"
              onChange={(lists) => {
                applicationWideSettingsBridge.update({ notificationsCountBadgeListIds: lists.map((l) => l.id) });
              }}
            />
          </SettingRow>
        </>
      )}
    </SettingsList>
  );
});
