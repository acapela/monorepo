import * as React from "react";

function SvgArrowCornerCcwLt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53 2.47a.75.75 0 010 1.06L5.81 7.25H12.06c1.837 0 3.292 0 4.43.153 1.173.158 2.121.49 2.87 1.238.748.749 1.08 1.698 1.238 2.87.153 1.14.153 2.595.153 4.433V19a.75.75 0 01-1.5 0V16c0-1.906-.002-3.261-.14-4.29-.135-1.005-.389-1.585-.812-2.008-.423-.423-1.003-.677-2.008-.812-1.027-.138-2.382-.14-4.288-.14H5.811l3.72 3.72a.75.75 0 11-1.061 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.06 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowCornerCcwLt = React.memo(SvgArrowCornerCcwLt);
export default MemoSvgArrowCornerCcwLt;
