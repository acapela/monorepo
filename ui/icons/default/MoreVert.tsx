import * as React from "react";

function SvgMoreVert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.25 5A2.756 2.756 0 0112 2.25 2.756 2.756 0 0114.75 5 2.756 2.756 0 0112 7.75 2.756 2.756 0 019.25 5zM12 3.75c-.686 0-1.25.564-1.25 1.25s.564 1.25 1.25 1.25 1.25-.564 1.25-1.25-.564-1.25-1.25-1.25zM9.25 12A2.756 2.756 0 0112 9.25 2.756 2.756 0 0114.75 12 2.756 2.756 0 0112 14.75 2.756 2.756 0 019.25 12zM12 10.75c-.686 0-1.25.564-1.25 1.25s.564 1.25 1.25 1.25 1.25-.564 1.25-1.25-.564-1.25-1.25-1.25zM9.25 19A2.756 2.756 0 0112 16.25 2.756 2.756 0 0114.75 19 2.756 2.756 0 0112 21.75 2.756 2.756 0 019.25 19zM12 17.75c-.686 0-1.25.564-1.25 1.25s.564 1.25 1.25 1.25 1.25-.564 1.25-1.25-.564-1.25-1.25-1.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMoreVert = React.memo(SvgMoreVert);
export default MemoSvgMoreVert;
