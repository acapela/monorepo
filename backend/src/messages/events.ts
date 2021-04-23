import { EventHandler } from "~backend/src/events/eventHandlers";
import { Message_Type_Enum } from "~frontend/src/gql";
// import logger from "~shared/logger";

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

export const handleMessageCreated: EventHandler<HasuraMessage> = {
  triggerName: "message_created",

  handleInsert: async (userId: string, message: HasuraMessage) => {
    console.log("message", message);
  },
};
