CREATE INDEX notification_asana_updated_at_idx on public.notification_asana using btree (updated_at);

CREATE INDEX notification_clickup_updated_at_idx on public.notification_clickup using btree (updated_at);

CREATE INDEX notification_drive_updated_at_idx on public.notification_drive using btree (updated_at);

CREATE INDEX notification_github_updated_at_idx on public.notification_github using btree (updated_at);

CREATE INDEX notification_gmail_updated_at_idx on public.notification_gmail using btree (updated_at);
