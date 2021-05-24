import * as React from "react";

function SvgCode(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53 6.53a.75.75 0 00-1.06-1.06l-6 6a.75.75 0 000 1.06l6 6a.75.75 0 001.06-1.06L4.06 12l5.47-5.47zm6-1.06a.75.75 0 10-1.06 1.06L19.94 12l-5.47 5.47a.75.75 0 101.06 1.06l6-6a.75.75 0 000-1.06l-6-6z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCode = React.memo(SvgCode);
export default MemoSvgCode;
