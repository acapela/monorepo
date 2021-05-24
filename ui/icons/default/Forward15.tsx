import * as React from "react";

function SvgForward15(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.25 12A9.731 9.731 0 0112 2.25c3.223 0 5.637 1.346 7.23 2.674.387.322.727.645 1.02.948V3.5a.75.75 0 011.5 0V8a.75.75 0 01-1.392.387l-.001-.001-.003-.005-.02-.033-.093-.139a8.919 8.919 0 00-.39-.522 11.348 11.348 0 00-1.581-1.61C16.863 4.903 14.777 3.75 12 3.75A8.231 8.231 0 003.75 12a8.25 8.25 0 0016.5 0 .75.75 0 011.5 0c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V9A.75.75 0 019 8.25zm3 0a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h2.25v1.5H12a.75.75 0 000 1.5h3a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-2.25v-1.5H15a.75.75 0 000-1.5h-3z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgForward15 = React.memo(SvgForward15);
export default MemoSvgForward15;
