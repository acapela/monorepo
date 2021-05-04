import { Message_Type_Enum } from "~frontend/gql";

export function chooseMessageTypeFromMimeType(mimeType: string): Message_Type_Enum {
  const category = mimeType?.split("/")[0].toLowerCase();

  switch (category) {
    case "audio":
      return Message_Type_Enum.Audio;
    case "video":
      return Message_Type_Enum.Video;
    default:
      // Message_Type_Enum.File is not used
      return Message_Type_Enum.Text;
  }
}
