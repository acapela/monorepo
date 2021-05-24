import * as React from "react";

function SvgTarget(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 12a8.25 8.25 0 1116.5 0 8.25 8.25 0 01-16.5 0zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTarget = React.memo(SvgTarget);
export default MemoSvgTarget;
