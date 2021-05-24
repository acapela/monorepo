import * as React from "react";

function SvgSlidersVert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 6.354a2.751 2.751 0 101.5 0V3a.75.75 0 00-1.5 0v3.354zM5 7.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM5.75 14a.75.75 0 00-1.5 0v7a.75.75 0 001.5 0v-7zm14-11a.75.75 0 00-1.5 0v3.354a2.751 2.751 0 101.5 0V3zm0 11a.75.75 0 00-1.5 0v7a.75.75 0 001.5 0v-7zM12 2.25a.75.75 0 01.75.75v7a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zm-.75 15.396V21a.75.75 0 001.5 0v-3.354a2.751 2.751 0 10-1.5 0zM19 7.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM10.75 15a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSlidersVert = React.memo(SvgSlidersVert);
export default MemoSvgSlidersVert;
