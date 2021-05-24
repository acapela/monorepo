import * as React from "react";

function SvgVector(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM6.776 14.33a8.204 8.204 0 017.554-7.554A3.751 3.751 0 0021.75 6a3.75 3.75 0 00-7.43-.727 9.705 9.705 0 00-9.047 9.047A3.751 3.751 0 006 21.75a3.75 3.75 0 00.776-7.42zM3.75 18a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgVector = React.memo(SvgVector);
export default MemoSvgVector;
