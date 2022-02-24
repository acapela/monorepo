import { NotificationInner } from "@aca/desktop/clientdb/notification";

type NotificationInnerKind = NotificationInner["__typename"];

type NotificationKindBundleRules<K extends NotificationInnerKind> = NotificationInner extends infer N
  ? N["__typename"] extends K
    ? N
    : never
  : never;

type FiltersUnion<U> = U extends infer T
  ? T extends { __typename: infer TN }
    ? {
        __typename: TN;
      } & FiltersData<Omit<T, "__typename">>
    : never
  : never;

type E = NotificationKindBundleRules<"notification_figma_comment">;

type BundleRules = {
  [key in NotificationInner["__typename"]]: any;
};
