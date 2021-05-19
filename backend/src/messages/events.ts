import { hasuraEvents } from "~backend/src/events/eventHandlers";
import { Message_Type_Enum } from "~frontend/src/gql";
import { sendForTranscription } from "../transcriptions/transcriptionService";

const MESSAGE_TYPES_TO_BE_PROCESSED = [Message_Type_Enum.Audio, Message_Type_Enum.Video];

hasuraEvents.addHandler("message_updates", "INSERT", async (message) => {
  if (!MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type as Message_Type_Enum)) {
    return;
  }

  await sendForTranscription(message.id);
});
