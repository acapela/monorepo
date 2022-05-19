import { makeAutoObservable } from "mobx";

type Animations = "swipe-up" | "swipe-down" | "instant";

export const animationStore = makeAutoObservable<{
  animation: Animations;
  currentNotification: string | null;
  targetNotification: string | null;
}>({
  currentNotification: null,
  targetNotification: null,
  animation: "instant",
});
