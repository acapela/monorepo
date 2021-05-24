import * as React from "react";

function SvgInfinity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 12a4.25 4.25 0 006.8 3.4.75.75 0 11.9 1.2 5.75 5.75 0 112.3-4.6 4.25 4.25 0 101.7-3.4.75.75 0 01-.901-1.2A5.75 5.75 0 1111.25 12a4.25 4.25 0 00-8.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgInfinity = React.memo(SvgInfinity);
export default MemoSvgInfinity;
