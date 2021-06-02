import * as React from "react";

function SvgVerticalThreeDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="4" height="12" viewBox="0 0 4 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.3335 1.33333C3.3335 0.6 2.7335 -2.62268e-08 2.00016 -5.82818e-08C1.26683 -9.03369e-08 0.66683 0.6 0.66683 1.33333C0.666829 2.06667 1.26683 2.66667 2.00016 2.66667C2.7335 2.66667 3.3335 2.06667 3.3335 1.33333ZM3.3335 10.6667C3.3335 9.93333 2.7335 9.33333 2.00016 9.33333C1.26683 9.33333 0.666829 9.93333 0.666829 10.6667C0.666829 11.4 1.26683 12 2.00016 12C2.7335 12 3.3335 11.4 3.3335 10.6667ZM2.00016 4.66667C2.7335 4.66667 3.3335 5.26667 3.3335 6C3.3335 6.73333 2.7335 7.33333 2.00016 7.33333C1.26683 7.33333 0.666829 6.73333 0.666829 6C0.666829 5.26667 1.26683 4.66667 2.00016 4.66667Z"
        fill="#7F7E7F"
      />
    </svg>
  );
}

const MemoSvgVerticalThreeDots = React.memo(SvgVerticalThreeDots);
export default MemoSvgVerticalThreeDots;
