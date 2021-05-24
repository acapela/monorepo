import * as React from "react";

function SvgForward5(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25A9.731 9.731 0 002.25 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75a.75.75 0 00-1.5 0 8.25 8.25 0 01-16.5 0A8.231 8.231 0 0112 3.75c2.777 0 4.863 1.154 6.27 2.326a11.348 11.348 0 011.582 1.611 8.919 8.919 0 01.481.661c.01.015.017.026.02.033l.004.005v.001A.75.75 0 0021.75 8V3.5a.75.75 0 00-1.5 0v2.372a12.889 12.889 0 00-1.02-.948C17.637 3.596 15.223 2.25 12 2.25zm-2 6a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3.25v1.5H10a.75.75 0 000 1.5h4a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-3.25v-1.5H14a.75.75 0 000-1.5h-4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgForward5 = React.memo(SvgForward5);
export default MemoSvgForward5;
