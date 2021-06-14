import { isPlainObject } from "lodash";
import { Primitive } from "utility-types";
import { typedKeys } from "~shared/object";
import { IsUnion } from "~shared/types";

type HasManyProps<T> = IsUnion<keyof T>;
type HasExactlyOneProp<T> = HasManyProps<T> extends true ? false : true;
type Empty = null | undefined;

export type UnwrapQueryData<T> = T extends Primitive
  ? T
  : T extends Empty
  ? UnwrapQueryData<NonNullable<T>> | undefined
  : HasExactlyOneProp<WithoutTypename<T>> extends true
  ? T[keyof WithoutTypename<T>]
  : T;

/**
 * This function will pick nested graphql query data if possible.
 *
 * Possible = there is only one query in gql document (which is 95-100% of the cases in our current codebase)
 *
 * Use case:
 *
 * Usually we have at least 1 level of unnecessary nesting at gql queries eg.
 *
 * query CurrentUser {
 *   user {
 *     id
 *     email
 *   }
 * }
 *
 * It is clear that we request only one piece of data in the query (user)
 *
 * But we still have to 'pick' it from 'queryResult':
 *
 * const [data] = useCurrentUserQuery();
 * const user = data.user
 *
 * As in strong majority of queries we have only 1 root query field, (like example above), we can pick it automatically
 * so instead of:
 *
 * const [data] = useCurrentUserQuery();
 * const user = data.user
 *
 * We can use simply:
 *
 * const [user] = useCurrentUserQuery();
 *
 * --------
 *
 * And this is exactly what this function does. It accept graphql data and unwraps nested data as long as there is only one query field.
 *
 * This function is fully type safe and will only process (both object and it's type) if there is only one key in data object (excluding __typename key which is always ignored)
 *
 * --------
 *
 * This function also works for multi-level nested data:
 *
 * query CurrentTeamOwner {
 *   currentTeam {
 *     ownerUser {
 *       id
 *       email
 *     }
 *   }
 * }
 *
 * const [user] = useCurrentTeamOwner();
 *
 * const id = user?.id;
 *
 * // instead of
 * const [data] = useCurrentTeamOwner();
 * const user = data?.currentTeam?.ownerUser;
 */
export function unwrapQueryData<T>(data: T): UnwrapQueryData<T> {
  type Result = UnwrapQueryData<T>;

  if (!isPlainObject(data)) {
    return data as Result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...restData } = data as WithTypename<T>;

  const keys = typedKeys(restData);

  if (keys.length !== 1) {
    return data as Result;
  }

  const [theOnlyKeyName] = keys;

  const pickedValue = data?.[theOnlyKeyName];

  if (pickedValue === undefined) {
    return pickedValue as Result;
  }

  return pickedValue as Result;
}

type WithTypename<T> = T & { __typename?: string };

type WithoutTypename<T> = Omit<T, "__typename">;
