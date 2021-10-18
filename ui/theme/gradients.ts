import { gradient } from "./utils/gradient";

export const gradients = {
  actionPageBg: gradient({
    steps: [
      { color: "#FFEED9", progress: 0 },
      { color: "#ffb8eb", progress: 1 },
    ],
    direction: 135,
  }),
};
