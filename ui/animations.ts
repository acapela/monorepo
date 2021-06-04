import { Transition } from "framer-motion";
import { PresenceStyles } from "./PresenceAnimator";

export const POP_ANIMATION_CONFIG: Transition = { type: "spring", bounce: 0, duration: 0.3 };

export const POP_PRESENCE_STYLES: PresenceStyles = { opacity: [0, 1], y: [3, 0], scale: [0.95, 1] };
