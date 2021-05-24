import * as React from "react";

function SvgRefreshCwAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.25 12A9.731 9.731 0 0112 2.25c3.223 0 5.637 1.346 7.23 2.674.387.322.727.645 1.02.948V3.5a.75.75 0 011.5 0V8a.75.75 0 01-.75.75h-3a.75.75 0 010-1.5h1.482a11.407 11.407 0 00-1.212-1.174C16.863 4.904 14.777 3.75 12 3.75A8.231 8.231 0 003.75 12a.75.75 0 01-1.5 0zM21 11.25a.75.75 0 01.75.75c0 5.385-4.365 9.75-9.75 9.75-2.745 0-4.918-1.38-6.368-2.694a13.792 13.792 0 01-.882-.877V20.5a.75.75 0 01-1.5 0V16a.75.75 0 01.75-.75h3.064a.75.75 0 010 1.5H5.49c.307.364.692.78 1.15 1.194C7.947 19.13 9.775 20.25 12 20.25A8.25 8.25 0 0020.25 12a.75.75 0 01.75-.75zm-9-4a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75zM12 16a1 1 0 100-2 1 1 0 000 2z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgRefreshCwAlert = React.memo(SvgRefreshCwAlert);
export default MemoSvgRefreshCwAlert;
