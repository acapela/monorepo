import * as React from "react";

function SvgScript(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.728 4.182a.75.75 0 00-1.456-.364l-4 16a.75.75 0 101.456.364l4-16zM6.53 7.47a.75.75 0 010 1.06L3.06 12l3.47 3.47a.75.75 0 01-1.06 1.06l-4-4a.75.75 0 010-1.06l4-4a.75.75 0 011.06 0zm10.94 0a.75.75 0 011.06 0l4 4a.75.75 0 010 1.06l-4 4a.75.75 0 11-1.06-1.06L20.94 12l-3.47-3.47a.75.75 0 010-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgScript = React.memo(SvgScript);
export default MemoSvgScript;
