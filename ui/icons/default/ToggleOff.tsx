import * as React from "react";

function SvgToggleOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3.25a8.75 8.75 0 000 17.5h4a8.75 8.75 0 100-17.5h-4zM2.75 12A7.25 7.25 0 0110 4.75h4a7.25 7.25 0 110 14.5h-4A7.25 7.25 0 012.75 12zm4 0a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM10 7.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgToggleOff = React.memo(SvgToggleOff);
export default MemoSvgToggleOff;
