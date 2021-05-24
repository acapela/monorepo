import * as React from "react";

function SvgLoader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 3a.75.75 0 01.75-.75c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12c0-1.555.365-3.027 1.014-4.334a.75.75 0 011.343.668A8.25 8.25 0 1012 3.75a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLoader2 = React.memo(SvgLoader2);
export default MemoSvgLoader2;
