import * as React from "react";

function SvgTextUnderline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75 4a.75.75 0 00-1.5 0v7a5.75 5.75 0 0011.5 0V4a.75.75 0 00-1.5 0v7a4.25 4.25 0 01-8.5 0V4zM6 19.25a.75.75 0 000 1.5h12a.75.75 0 000-1.5H6z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTextUnderline = React.memo(SvgTextUnderline);
export default MemoSvgTextUnderline;
