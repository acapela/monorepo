import * as React from "react";

function SvgCrossOctagon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2.25a.75.75 0 00-.53.22l-5 5a.75.75 0 00-.22.53v8c0 .199.079.39.22.53l5 5c.14.141.331.22.53.22h8a.75.75 0 00.53-.22l5-5a.75.75 0 00.22-.53V8a.75.75 0 00-.22-.53l-5-5a.75.75 0 00-.53-.22H8zM3.75 8.31l4.56-4.56h7.38l4.56 4.56v7.38l-4.56 4.56H8.31l-4.56-4.56V8.31zm5.78.16a.75.75 0 00-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 101.06 1.06L12 13.06l2.47 2.47a.75.75 0 101.06-1.06L13.06 12l2.47-2.47a.75.75 0 00-1.06-1.06L12 10.94 9.53 8.47z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCrossOctagon = React.memo(SvgCrossOctagon);
export default MemoSvgCrossOctagon;
