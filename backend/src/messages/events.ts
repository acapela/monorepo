import { Message } from "~db";
import { Message_Type_Enum } from "~gql";
import { sendForTranscription } from "../transcriptions/transcriptionService";

const MESSAGE_TYPES_TO_BE_PROCESSED: Message_Type_Enum[] = ["AUDIO", "VIDEO"];

export async function handleMessageCreated(message: Message) {
  if (!MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type as Message_Type_Enum)) {
    return;
  }

  await sendForTranscription(message.id);
}
