import * as React from "react";

function SvgRotateCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.77 4.924C6.363 3.596 8.777 2.25 12 2.25A9.731 9.731 0 0121.75 12c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12a.75.75 0 011.5 0 8.25 8.25 0 0016.5 0A8.231 8.231 0 0012 3.75c-2.777 0-4.863 1.154-6.27 2.326-.49.408-.894.816-1.212 1.174H7a.75.75 0 010 1.5H3A.75.75 0 012.25 8V3.5a.75.75 0 011.5 0v2.372c.293-.303.633-.626 1.02-.948z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgRotateCcw = React.memo(SvgRotateCcw);
export default MemoSvgRotateCcw;
