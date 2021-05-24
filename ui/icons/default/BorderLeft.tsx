import * as React from "react";

function SvgBorderLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.75 3a.75.75 0 00-1.5 0v18a.75.75 0 001.5 0V3zM20 5a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zM9 20a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm-8-4a1 1 0 11-2 0 1 1 0 012 0zm4-4a1 1 0 11-2 0 1 1 0 012 0zm-5 1a1 1 0 100-2 1 1 0 000 2zm-3-1a1 1 0 11-2 0 1 1 0 012 0zm4-4a1 1 0 11-2 0 1 1 0 012 0zm4-4a1 1 0 11-2 0 1 1 0 012 0zm-5 1a1 1 0 100-2 1 1 0 000 2zM9 4a1 1 0 11-2 0 1 1 0 012 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBorderLeft = React.memo(SvgBorderLeft);
export default MemoSvgBorderLeft;
