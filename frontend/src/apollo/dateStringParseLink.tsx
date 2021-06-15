import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { DocumentNode } from "graphql";
import { isArray, isObject, mapValues } from "lodash";
import { tryParseStringDate } from "~shared/dates/parseJSONWithDates";

export function mapObjectValues<T>(object: T, callback: (value: unknown) => unknown): any {
  if (isArray(object)) {
    return object.map((value) => mapObjectValues(value, callback));
  }

  if (!isObject(object)) {
    return callback(object);
  }

  return mapValues(object, (value) => mapObjectValues(value, callback));
}

if (typeof window !== "undefined") {
  Reflect.set(window, "par", tryParseStringDate);
}
console.log("parser", tryParseStringDate);

export function parseStringDatesInObject<T>(object: T): void {
  return mapObjectValues(object, tryParseStringDate);
}

export function isSubscription(query: DocumentNode) {
  const definition = getMainDefinition(query);

  return definition.kind === "OperationDefinition" && definition.operation === "subscription";
}

function parseResponse(response: FetchResult) {
  if (response.data) {
    console.log("yoyoyo", response);
    try {
      const foo = parseStringDatesInObject(response.data);

      if (foo) {
        console.log("HERE WE GO", { foo, response });
        response.data = foo;
      }

      console.log(foo);
    } catch (err) {
      console.log("err", err);
    }

    // return foo;
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
