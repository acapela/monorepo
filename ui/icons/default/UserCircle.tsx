import * as React from "react";

function SvgUserCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75a9.25 9.25 0 100 18.5 9.25 9.25 0 000-18.5zM1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12zm9.417 1.75a1.917 1.917 0 00-1.917 1.917c0 .322.261.583.583.583h5.334a.583.583 0 00.583-.583 1.917 1.917 0 00-1.917-1.917h-2.666zM7.25 15.667a3.417 3.417 0 013.417-3.417h2.666a3.417 3.417 0 013.417 3.417c0 1.15-.933 2.083-2.083 2.083H9.333a2.083 2.083 0 01-2.083-2.083zM10.75 8a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM12 5.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgUserCircle = React.memo(SvgUserCircle);
export default MemoSvgUserCircle;
