import * as React from "react";

function SvgArrowCornerCwLt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.47 2.47a.75.75 0 011.06 0l5 5a.75.75 0 11-1.06 1.06L9.75 4.81V11c0 1.907.002 3.261.14 4.29.135 1.005.389 1.585.812 2.008.423.423 1.003.677 2.009.812 1.027.139 2.382.14 4.289.14h3a.75.75 0 110 1.5h-3.056c-1.838 0-3.294 0-4.433-.153-1.172-.158-2.121-.49-2.87-1.238-.748-.749-1.08-1.698-1.238-2.87-.153-1.14-.153-2.595-.153-4.433V4.81L4.53 8.53a.75.75 0 01-1.06-1.06l5-5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowCornerCwLt = React.memo(SvgArrowCornerCwLt);
export default MemoSvgArrowCornerCwLt;
