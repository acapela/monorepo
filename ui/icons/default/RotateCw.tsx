import * as React from "react";

function SvgRotateCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.25 12A9.731 9.731 0 0112 2.25c3.223 0 5.637 1.346 7.23 2.674.387.322.727.645 1.02.948V3.5a.75.75 0 011.5 0V8a.75.75 0 01-.75.75h-4a.75.75 0 010-1.5h2.482a11.407 11.407 0 00-1.212-1.174C16.863 4.904 14.777 3.75 12 3.75A8.231 8.231 0 003.75 12a8.25 8.25 0 0016.5 0 .75.75 0 011.5 0c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgRotateCw = React.memo(SvgRotateCw);
export default MemoSvgRotateCw;
