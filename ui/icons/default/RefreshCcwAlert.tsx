import * as React from "react";

function SvgRefreshCcwAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.77 4.924C6.363 3.596 8.777 2.25 12 2.25A9.731 9.731 0 0121.75 12a.75.75 0 01-1.5 0A8.231 8.231 0 0012 3.75c-2.777 0-4.863 1.154-6.27 2.326-.49.408-.894.816-1.212 1.174H6a.75.75 0 010 1.5H3A.75.75 0 012.25 8V3.5a.75.75 0 011.5 0v2.372c.293-.303.633-.626 1.02-.948zM3 11.25a.75.75 0 01.75.75A8.25 8.25 0 0012 20.25c2.225 0 4.053-1.12 5.36-2.306.458-.414.843-.83 1.15-1.194H17a.75.75 0 010-1.5h3a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-2.321c-.26.282-.554.58-.882.877-1.45 1.314-3.622 2.694-6.368 2.694-5.385 0-9.75-4.365-9.75-9.75a.75.75 0 01.75-.75zm9-4a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75zM12 16a1 1 0 100-2 1 1 0 000 2z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgRefreshCcwAlert = React.memo(SvgRefreshCcwAlert);
export default MemoSvgRefreshCcwAlert;
