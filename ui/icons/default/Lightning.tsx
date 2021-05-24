import * as React from "react";

function SvgLightning(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.217 1.282A.75.75 0 0114.75 2v7.25H19a.75.75 0 01.624 1.166l-8 12A.75.75 0 0110.25 22v-7.25H6a.75.75 0 01-.624-1.166l8-12a.75.75 0 01.841-.302zM7.401 13.25H11a.75.75 0 01.75.75v5.523l5.849-8.773H14a.75.75 0 01-.75-.75V4.477L7.401 13.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLightning = React.memo(SvgLightning);
export default MemoSvgLightning;
