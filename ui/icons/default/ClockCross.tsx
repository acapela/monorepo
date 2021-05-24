import * as React from "react";

function SvgClockCross(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.53 2.53a.75.75 0 00-1.06-1.06l-3 3a.75.75 0 001.06 1.06l3-3zM3.75 12a8.25 8.25 0 1116.5 0 8.25 8.25 0 01-16.5 0zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm6.47-.78a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-3-3a.75.75 0 00-1.06 0zm-8.94 7a.75.75 0 00-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 101.06 1.06L12 13.06l2.47 2.47a.75.75 0 101.06-1.06L13.06 12l2.47-2.47a.75.75 0 00-1.06-1.06L12 10.94 9.53 8.47z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgClockCross = React.memo(SvgClockCross);
export default MemoSvgClockCross;
