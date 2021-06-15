import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { DocumentNode } from "graphql";
import { isObject, mapValues } from "lodash";

export function mapObjectValues<T>(object: T, callback: (value: unknown) => unknown): any {
  if (!isObject(object)) {
    return callback(object);
  }

  return mapValues(object, (value) => mapObjectValues(value, callback));
}

function tryParseDateString(input: unknown): unknown {
  if (typeof input !== "string") {
    return input;
  }

  const parsedDate = Date.parse(input);

  if (isNaN(parsedDate)) {
    return input;
  }

  return new Date(parsedDate);
}

export function parseStringDatesInObject<T>(object: T): void {
  mapObjectValues(object, tryParseDateString);
}

export function isSubscription(query: DocumentNode) {
  const definition = getMainDefinition(query);

  return definition.kind === "OperationDefinition" && definition.operation === "subscription";
}

function parseResponse(response: FetchResult) {
  if (response.data) {
    parseStringDatesInObject(response.data);
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
