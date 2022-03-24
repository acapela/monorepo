import { observer } from "mobx-react";
import React from "react";

import { SlackConversationsQuery } from "@aca/gql";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";

interface Props {
  checkSelected: (id: string) => boolean;
  handleDropdownOpen: () => void;
  conversations: SlackConversationsQuery["slack_conversations"];
  onChange: (conversations: SlackConversationsQuery["slack_conversations"]) => void;
  isDisabled?: boolean;

  className?: string;
  placeholder?: string;
}

export const SlackTeamConversationsDropdown = observer(
  ({
    checkSelected,
    onChange,
    conversations,
    handleDropdownOpen,
    isDisabled,

    className,
    placeholder,
  }: Props) => {
    return (
      <MultipleOptionsDropdown<typeof conversations[number]>
        className={className}
        placeholder={placeholder ?? "All"}
        items={conversations}
        keyGetter={(channel) => channel.id}
        isDisabled={isDisabled}
        labelGetter={(channel) => (channel.is_private ? "🔒" : "#") + channel.name}
        selectedItems={conversations.filter(({ id }) => checkSelected(id))}
        onOpen={handleDropdownOpen}
        onChange={onChange}
      />
    );
  }
);
