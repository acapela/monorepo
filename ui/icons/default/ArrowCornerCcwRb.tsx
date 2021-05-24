import * as React from "react";

function SvgArrowCornerCcwRb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.47 19.53a.75.75 0 001.06 0l5-5a.75.75 0 000-1.06l-5-5a.75.75 0 10-1.06 1.06l3.72 3.72H12c-1.907 0-3.261-.002-4.29-.14-1.005-.135-1.585-.389-2.008-.812-.423-.423-.677-1.003-.812-2.009C4.752 9.261 4.75 7.907 4.75 6V3a.75.75 0 00-1.5 0v3.056c0 1.838 0 3.294.153 4.433.158 1.172.49 2.121 1.238 2.87.749.748 1.698 1.08 2.87 1.238 1.14.153 2.595.153 4.433.153H18.189l-3.72 3.72a.75.75 0 000 1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowCornerCcwRb = React.memo(SvgArrowCornerCcwRb);
export default MemoSvgArrowCornerCcwRb;
