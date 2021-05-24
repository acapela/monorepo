import * as React from "react";

function SvgStopwatchSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 .25a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4zM3.53 3.47a.75.75 0 00-1.06 1.06l2.126 2.126A9.714 9.714 0 002.25 13c0 5.385 4.365 9.75 9.75 9.75a9.714 9.714 0 006.344-2.346l2.126 2.126a.75.75 0 101.06-1.06l-2.636-2.636-6.364-6.364-6.364-6.364L3.53 3.47zM3.75 13c0-2.008.717-3.848 1.91-5.28l5.81 5.81 5.81 5.81A8.25 8.25 0 013.75 13zm4.584-7.393A8.213 8.213 0 0112 4.75c2.278 0 4.34.923 5.834 2.416A8.222 8.222 0 0120.25 13a8.212 8.212 0 01-.857 3.666.75.75 0 001.343.668A9.713 9.713 0 0021.75 13a9.714 9.714 0 00-2.346-6.344L21.03 5.03a.75.75 0 00-1.06-1.06l-1.626 1.626A9.714 9.714 0 0012 3.25a9.713 9.713 0 00-4.334 1.014.75.75 0 00.668 1.343z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgStopwatchSlash = React.memo(SvgStopwatchSlash);
export default MemoSvgStopwatchSlash;
