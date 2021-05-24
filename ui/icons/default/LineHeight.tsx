import * as React from "react";

function SvgLineHeight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 3A.75.75 0 014 2.25h16a.75.75 0 010 1.5H4A.75.75 0 013.25 3zm0 18a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zm9.42-13.335a.75.75 0 00-1.34 0l-2.5 5-1.5 3a.75.75 0 101.34.67l1.294-2.585h4.072l1.293 2.585a.75.75 0 101.342-.67l-1.5-3-2.5-5zM12 9.677l1.287 2.573h-2.574L12 9.677z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLineHeight = React.memo(SvgLineHeight);
export default MemoSvgLineHeight;
