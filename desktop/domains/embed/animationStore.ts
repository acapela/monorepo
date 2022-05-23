import { makeAutoObservable } from "mobx";

export type HorizontalAnimations = "swipe-left" | "swipe-right";
export type VerticalAnimations = "swipe-up" | "swipe-down";

export type MovementAnimations = HorizontalAnimations | VerticalAnimations;
export type Animations = "instant" | MovementAnimations;

export const animationStore = makeAutoObservable<{
  upcomingEmbedAnimation: Animations;
  isAnimating: boolean;
}>({
  upcomingEmbedAnimation: "instant",
  isAnimating: false,
});
