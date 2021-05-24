import * as React from "react";

function SvgSortNumberReverse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 2.25a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3.25v1.5H15a.75.75 0 000 1.5h4a.75.75 0 00.75-.75V3a.75.75 0 00-.75-.75h-4zm3.25 1.5v1.5h-2.5v-1.5h2.5zM7 5.25a.75.75 0 01.75.75v10.19l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V6A.75.75 0 017 5.25zm10.287 7.057a.75.75 0 01.463.693v5.25H19a.75.75 0 010 1.5h-4a.75.75 0 010-1.5h1.25v-3.44l-.72.72a.75.75 0 11-1.06-1.06l2-2a.75.75 0 01.817-.163z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSortNumberReverse = React.memo(SvgSortNumberReverse);
export default MemoSvgSortNumberReverse;
