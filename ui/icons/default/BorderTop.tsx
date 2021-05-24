import * as React from "react";

function SvgBorderTop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3.25a.75.75 0 000 1.5h18a.75.75 0 000-1.5H3zM21 8a1 1 0 11-2 0 1 1 0 012 0zm-1 5a1 1 0 100-2 1 1 0 000 2zm1 3a1 1 0 11-2 0 1 1 0 012 0zM4 21a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm-9-3a1 1 0 100-2 1 1 0 000 2zm-7-1a1 1 0 11-2 0 1 1 0 012 0zm12-4a1 1 0 11-2 0 1 1 0 012 0zm-5 1a1 1 0 100-2 1 1 0 000 2zm-3-1a1 1 0 11-2 0 1 1 0 012 0zm-5 1a1 1 0 100-2 1 1 0 000 2zm8-4a1 1 0 100-2 1 1 0 000 2zM5 8a1 1 0 11-2 0 1 1 0 012 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBorderTop = React.memo(SvgBorderTop);
export default MemoSvgBorderTop;
