import React from "react";

interface Props {
  height: number;
}

export const Spacer = ({ height }: Props) => {
  return <div style={{ height }} />;
};
