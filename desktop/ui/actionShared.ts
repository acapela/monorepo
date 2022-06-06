export type ActionNotApplicableMode = "disable" | "hide" | "assert" | "notClickable";

export interface SharedActionButtonProps {
  notApplicableMode?: ActionNotApplicableMode;
}
