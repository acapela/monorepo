import { injectProps } from "@aca/shared/components/injectProps";
import { IconButton } from "@aca/ui/buttons/IconButton";

export const TopBarButton = injectProps(IconButton, { size: "compactWide", kind: "transparent" });
