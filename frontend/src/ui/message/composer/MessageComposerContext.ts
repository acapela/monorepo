import React from "react";

type ComposerMode = "creating" | "editing" | "read-only";

interface MessageComposerContextData {
  mode: ComposerMode;
}

export const messageComposerDefaultValue: MessageComposerContextData = {
  mode: "read-only",
};

export const MessageComposerContext = React.createContext<MessageComposerContextData>(messageComposerDefaultValue);
