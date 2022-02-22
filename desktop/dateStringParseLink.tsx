import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { DocumentNode } from "graphql";
import { isArray, isObject, mapValues } from "lodash";

import { tryParseStringDate } from "@aca/shared/dates/parseJSONWithDates";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapObjectValues<T>(object: T, callback: (value: unknown) => unknown): any {
  if (isArray(object)) {
    return object.map((value) => mapObjectValues(value, callback));
  }

  if (!isObject(object)) {
    return callback(object);
  }

  return mapValues(object, (value) => mapObjectValues(value, callback));
}

export function parseStringDatesInObject<T>(object: T): void {
  return mapObjectValues(object, tryParseStringDate);
}

export function isSubscription(query: DocumentNode) {
  const definition = getMainDefinition(query);

  return definition.kind === "OperationDefinition" && definition.operation === "subscription";
}

function parseResponse(response: FetchResult) {
  if (response.data) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dataWithDates = parseStringDatesInObject(response.data);
    } catch (err) {
      console.error("err", err);
    }
  }

  return response;
}

export function createDateParseLink() {
  return new ApolloLink((operation, forward) => {
    if (isSubscription(operation.query)) {
      return new Observable<FetchResult>((observer) =>
        forward(operation).subscribe((response) => observer.next(parseResponse(response)))
      );
    }

    return forward(operation).map((response) => parseResponse(response));
  });
}
