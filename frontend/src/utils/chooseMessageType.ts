import { Message_Type_Enum } from "@aca/gql";

export function chooseMessageTypeFromMimeType(mimeType: string): Message_Type_Enum {
  const category = mimeType?.split("/")[0].toLowerCase();

  switch (category) {
    case "audio":
      return "AUDIO";
    case "video":
      return "VIDEO";
    default:
      // Message_Type_Enum.File is not used
      return "TEXT";
  }
}
