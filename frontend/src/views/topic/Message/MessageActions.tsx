import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

interface Props {
  isActive: boolean;
  onActiveChange(isActive: boolean): void;
  onRemoveRequest: () => void;
  onEditRequest: () => void;
}

export const MessageActions = ({ isActive, onActiveChange, onEditRequest, onRemoveRequest }: Props) => {
  async function handleRemoveWithConfirm() {
    const didConfirm = await openConfirmPrompt({
      title: "Are you sure?",
      description: "This action cannot be undone.",
      confirmLabel: "Remove message",
    });

    if (!didConfirm) return;

    onRemoveRequest();
  }

  return (
    <>
      <PopoverMenuTrigger
        onOpen={() => onActiveChange(true)}
        onClose={() => onActiveChange(false)}
        options={[
          { label: "Edit message", onSelect: () => onEditRequest(), icon: <IconEdit /> },
          { label: "Delete message", onSelect: handleRemoveWithConfirm, isDestructive: true, icon: <IconTrash /> },
        ]}
      >
        <OptionsButton tooltip={isActive ? undefined : "Show Options"} />
      </PopoverMenuTrigger>
    </>
  );
};
