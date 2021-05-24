import * as React from "react";

function SvgArrowCornerCwRb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.29 3.89c-1.028-.138-2.383-.14-4.29-.14H4a.75.75 0 010-1.5h3.056c1.838 0 3.294 0 4.433.153 1.172.158 2.121.49 2.87 1.238.748.749 1.08 1.698 1.238 2.87.153 1.14.153 2.595.153 4.433v6.246l3.72-3.72a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-1.06 0l-5-5a.75.75 0 011.06-1.06l3.72 3.72V11c0-1.907-.002-3.261-.14-4.29-.135-1.005-.389-1.585-.812-2.008-.423-.423-1.003-.677-2.009-.812z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowCornerCwRb = React.memo(SvgArrowCornerCwRb);
export default MemoSvgArrowCornerCwRb;
