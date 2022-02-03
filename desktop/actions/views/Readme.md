Those are 'view' utils for given page views

This is needed for properly handle actions like 'go to next thing'

eg. in list mode - next thing can be group or notification. Also, if group is opened, we consider notifications of this group as 'possibly next', but if it is closed, we do not.

In focus mode, we always consider all notifications, but also order them by group.

As those information are needed across many actions (eg. after resolving, focus next thing), we have views that makes it way simpler and consistent across given group of actions
