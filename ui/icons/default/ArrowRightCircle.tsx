import * as React from "react";

function SvgArrowRightCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 12a9.25 9.25 0 1118.5 0 9.25 9.25 0 01-18.5 0zM12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25zm1.53 7.22a.75.75 0 10-1.06 1.06l1.72 1.72H8a.75.75 0 000 1.5h6.19l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowRightCircle = React.memo(SvgArrowRightCircle);
export default MemoSvgArrowRightCircle;
