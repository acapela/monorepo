import * as React from "react";

function SvgCd(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75a9.25 9.25 0 100 18.5 9.25 9.25 0 000-18.5zM1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12zm10-6a.75.75 0 01.75-.75A6.75 6.75 0 0118.75 12a.75.75 0 01-1.5 0c0-2.9-2.35-5.25-5.25-5.25a.75.75 0 01-.75-.75zm-.5 6a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM12 9.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCd = React.memo(SvgCd);
export default MemoSvgCd;
