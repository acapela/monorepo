import * as React from "react";

function SvgMinusOctagon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2.25a.75.75 0 00-.53.22l-5 5a.75.75 0 00-.22.53v8c0 .199.079.39.22.53l5 5c.14.141.331.22.53.22h8a.75.75 0 00.53-.22l5-5a.75.75 0 00.22-.53V8a.75.75 0 00-.22-.53l-5-5a.75.75 0 00-.53-.22H8zM3.75 8.31l4.56-4.56h7.38l4.56 4.56v7.38l-4.56 4.56H8.31l-4.56-4.56V8.31zM8 11.25a.75.75 0 000 1.5h8a.75.75 0 000-1.5H8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMinusOctagon = React.memo(SvgMinusOctagon);
export default MemoSvgMinusOctagon;
