import { HTMLMotionProps, motion } from "framer-motion";
import styled from "styled-components";

import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";

export const layoutAnimations = {
  newTopic: {
    title: (topicId: string) => `topic-title-${topicId}`,
    message: (topicId: string) => `topic-first-message-${topicId}`,
    messageTools: (topicId: string) => `topic-message-tools-buttons-${topicId}`,
  },
};

type Props = HTMLMotionProps<"div">;

export const PageLayoutAnimator = styled(function PageLayoutAnimator(props: Props) {
  const { layoutId } = props;
  return (
    <UIAnimator
      {...props}
      layout={layoutId ? "position" : undefined}
      transition={layoutId ? POP_ANIMATION_CONFIG : undefined}
    />
  );
})``;

const UIAnimator = styled(motion.div)`
  will-change: transform;
  transform: translate3d(0, 0, 0);
`;
