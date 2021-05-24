import * as React from "react";

function SvgArrowsMove(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.47 6.53a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V9a.75.75 0 01-1.5 0V4.81L9.53 6.53a.75.75 0 01-1.06 0zm10.06 1.94a.75.75 0 10-1.06 1.06l1.72 1.72H15a.75.75 0 000 1.5h4.19l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3zm-13.06 0a.75.75 0 011.06 1.06l-1.72 1.72H9a.75.75 0 010 1.5H4.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3zm3 10.06a.75.75 0 111.06-1.06l1.72 1.72V15a.75.75 0 011.5 0v4.19l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowsMove = React.memo(SvgArrowsMove);
export default MemoSvgArrowsMove;
