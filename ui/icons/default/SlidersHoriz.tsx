import * as React from "react";

function SvgSlidersHoriz(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 2.25a2.75 2.75 0 102.646 3.5H21a.75.75 0 000-1.5h-3.354a2.751 2.751 0 00-2.646-2zM16.25 5a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM3 4.25a.75.75 0 000 1.5h7a.75.75 0 000-1.5H3zm0 14a.75.75 0 000 1.5h7a.75.75 0 000-1.5H3zm12-2c1.259 0 2.32.846 2.646 2H21a.75.75 0 010 1.5h-3.354A2.751 2.751 0 1115 16.25zm0 4a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM2.25 12a.75.75 0 01.75-.75h3.354a2.751 2.751 0 015.396.75 2.75 2.75 0 01-5.396.75H3a.75.75 0 01-.75-.75zm11 0a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm-5.5 0a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSlidersHoriz = React.memo(SvgSlidersHoriz);
export default MemoSvgSlidersHoriz;
