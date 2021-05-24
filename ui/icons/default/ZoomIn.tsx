import * as React from "react";

function SvgZoomIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 3.75a7.25 7.25 0 100 14.5 7.25 7.25 0 000-14.5zM2.25 11a8.75 8.75 0 1115.445 5.634l2.835 2.836a.75.75 0 11-1.06 1.06l-2.836-2.835A8.75 8.75 0 012.25 11zm9.5-3a.75.75 0 00-1.5 0v2.25H8a.75.75 0 000 1.5h2.25V14a.75.75 0 001.5 0v-2.25H14a.75.75 0 000-1.5h-2.25V8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgZoomIn = React.memo(SvgZoomIn);
export default MemoSvgZoomIn;
