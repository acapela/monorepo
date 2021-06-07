import { ReactNode } from "react";
import { useRichEditorFormat } from "./context";
import { ToolbarButton } from "./ToolbarButton";

interface Props {
  formatName: string;
  icon: ReactNode;
  value?: string;
  tooltipLabel?: string;
}

export function ToggleEditorFormatButton({ icon, formatName, value, tooltipLabel }: Props) {
  const { isEnabled, toggle } = useRichEditorFormat(formatName, value);
  return <ToolbarButton icon={icon} isHighlighted={isEnabled} onClick={toggle} tooltipLabel={tooltipLabel} />;
}
