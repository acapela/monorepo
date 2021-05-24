import * as React from "react";

function SvgArrowCornerCwLb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 2.25a.75.75 0 00-.75.75V6c0 1.907-.002 3.261-.14 4.29-.135 1.005-.389 1.585-.812 2.008-.423.423-1.003.677-2.009.812-1.028.138-2.382.14-4.289.14H5.81l3.72-3.72a.75.75 0 00-1.06-1.06l-5 5a.75.75 0 000 1.06l5 5a.75.75 0 001.06-1.06l-3.72-3.72h6.246c1.838 0 3.294 0 4.433-.153 1.172-.158 2.121-.49 2.87-1.238.748-.749 1.08-1.698 1.238-2.87.153-1.14.153-2.595.153-4.433V3a.75.75 0 00-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowCornerCwLb = React.memo(SvgArrowCornerCwLb);
export default MemoSvgArrowCornerCwLb;
