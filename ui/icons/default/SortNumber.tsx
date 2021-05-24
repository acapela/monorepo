import * as React from "react";

function SvgSortNumber(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.287 2.307A.75.75 0 0117.75 3v5.25H19a.75.75 0 010 1.5h-4a.75.75 0 010-1.5h1.25V4.81l-.72.72a.75.75 0 11-1.06-1.06l2-2a.75.75 0 01.817-.163zM7 5.25a.75.75 0 01.75.75v10.19l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 011.06-1.06l1.72 1.72V6A.75.75 0 017 5.25zM19.75 13a.75.75 0 00-.75-.75h-4a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3.25v1.5H15a.75.75 0 000 1.5h4a.75.75 0 00.75-.75v-6zm-1.5.75v1.5h-2.5v-1.5h2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSortNumber = React.memo(SvgSortNumber);
export default MemoSvgSortNumber;
