import * as React from "react";

function SvgBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 0C2.79086 0 1 1.79086 1 4V6L0 8V9H10V8L9 6V4C9 1.79086 7.20914 0 5 0ZM5 12C6.10457 12 7 11.1046 7 10H3C3 11.1046 3.89543 12 5 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBell = React.memo(SvgBell);
export default MemoSvgBell;
