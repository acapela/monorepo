import { Message } from "~db";
import { Message_Type_Enum } from "~frontend/src/gql";
import { sendForTranscription } from "../transcriptions/transcriptionService";

const MESSAGE_TYPES_TO_BE_PROCESSED = [Message_Type_Enum.Audio, Message_Type_Enum.Video];

export async function handleMessageCreated(message: Message) {
  if (!MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type as Message_Type_Enum)) {
    return;
  }

  await sendForTranscription(message.id);
}
