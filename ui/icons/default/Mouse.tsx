import * as React from "react";

function SvgMouse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25A7.75 7.75 0 004.25 10v4a7.75 7.75 0 0015.5 0v-4A7.75 7.75 0 0012 2.25zM5.75 10a6.25 6.25 0 1112.5 0v4a6.25 6.25 0 11-12.5 0v-4zm7-2a.75.75 0 00-1.5 0v2a.75.75 0 001.5 0V8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMouse = React.memo(SvgMouse);
export default MemoSvgMouse;
