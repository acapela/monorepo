import * as React from "react";

function SvgPauseCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75a9.25 9.25 0 100 18.5 9.25 9.25 0 000-18.5zM1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12zM10 8.75a.75.75 0 01.75.75v5a.75.75 0 01-1.5 0v-5a.75.75 0 01.75-.75zm4.75.75a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPauseCircle = React.memo(SvgPauseCircle);
export default MemoSvgPauseCircle;
