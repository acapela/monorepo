import * as React from "react";

function SvgShare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.325 4.25A3.751 3.751 0 0121.75 5a3.75 3.75 0 01-7.425.75H9a3.251 3.251 0 00-3.183 2.59 3.751 3.751 0 010 7.32A3.251 3.251 0 009 18.25h5.325a3.751 3.751 0 017.425.75 3.75 3.75 0 01-7.425.75H9a4.751 4.751 0 01-4.701-4.065 3.751 3.751 0 010-7.37A4.751 4.751 0 019 4.25h5.325zM18 2.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-13 7a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM15.75 19a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgShare = React.memo(SvgShare);
export default MemoSvgShare;
