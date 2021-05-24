import * as React from "react";

function SvgFrameBounds(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 2a.75.75 0 00-1.5 0v2.25H2a.75.75 0 000 1.5h2.25v12.5H2a.75.75 0 000 1.5h2.25V22a.75.75 0 001.5 0v-2.25h12.5V22a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V5.75H22a.75.75 0 000-1.5h-2.25V2a.75.75 0 00-1.5 0v2.25H5.75V2zm12.5 16.25V5.75H5.75v12.5h12.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFrameBounds = React.memo(SvgFrameBounds);
export default MemoSvgFrameBounds;
