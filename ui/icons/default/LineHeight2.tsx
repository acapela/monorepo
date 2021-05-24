import * as React from "react";

function SvgLineHeight2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.53 3.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 001.06 1.06l1.72-1.72v12.38l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V5.81l1.72 1.72a.75.75 0 001.06-1.06l-3-3zM11.25 5a.75.75 0 01.75-.75h10a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zm.75 6.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5H12zm0 7a.75.75 0 000 1.5h10a.75.75 0 000-1.5H12z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLineHeight2 = React.memo(SvgLineHeight2);
export default MemoSvgLineHeight2;
