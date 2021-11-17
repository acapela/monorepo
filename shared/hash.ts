import { v5 as hashIntoUUID } from "uuid";

const UUID_NAMESPACE = "0db0c44a-90e6-416c-8341-d1cdb04775e9";
export function getHash(input: string) {
  return hashIntoUUID(input, UUID_NAMESPACE);
}
