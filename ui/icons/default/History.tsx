import * as React from "react";

function SvgHistory(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25c-3.223 0-5.637 1.346-7.23 2.674-.387.322-.727.645-1.02.948V4a.75.75 0 00-1.5 0v4c0 .414.336.75.75.75h3.5a.75.75 0 000-1.5H4.518c.318-.358.723-.766 1.212-1.174C7.137 4.904 9.223 3.75 12 3.75A8.231 8.231 0 0120.25 12a8.25 8.25 0 11-16.5 0 .75.75 0 00-1.5 0c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75A9.731 9.731 0 0012 2.25zM12.75 8a.75.75 0 00-1.5 0v4c0 .25.125.485.334.624l3 2a.75.75 0 10.832-1.248l-2.666-1.777V8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgHistory = React.memo(SvgHistory);
export default MemoSvgHistory;
