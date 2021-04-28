import { EventHandler } from "~backend/src/events/eventHandlers";
import { Message_Type_Enum } from "~frontend/src/gql";
import { sendForTranscription } from "../transcriptions/transcriptionService";

interface HasuraMessage {
  id: string;
  type: Message_Type_Enum;
  thread_id: string;
  text: string;
  is_draft: boolean;
  created_at: string;
  user_id: string;
  transcription: string | null;
}

const MESSAGE_TYPES_TO_BE_PROCESSED = [Message_Type_Enum.Audio, Message_Type_Enum.Video];

export const handleMessageCreated: EventHandler<HasuraMessage> = {
  triggerName: "message_created",

  handleInsert: async (userId: string, message: HasuraMessage) => {
    if (!MESSAGE_TYPES_TO_BE_PROCESSED.includes(message.type)) {
      return;
    }

    await sendForTranscription(message.id);
  },
};
