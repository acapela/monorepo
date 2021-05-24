import * as React from "react";

function SvgArrowCornerCcwRt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.47 2.47a.75.75 0 011.06 0l5 5a.75.75 0 01-1.06 1.06l-3.72-3.72V11.058c0 1.837 0 3.293-.153 4.432-.158 1.172-.49 2.121-1.238 2.87-.749.748-1.698 1.08-2.87 1.238-1.14.153-2.595.153-4.433.153H4a.75.75 0 010-1.5h3c1.907 0 3.261-.002 4.29-.14 1.005-.135 1.585-.389 2.008-.812.423-.423.677-1.003.812-2.009.138-1.027.14-2.382.14-4.289V4.81l-3.72 3.72a.75.75 0 11-1.06-1.06l5-5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowCornerCcwRt = React.memo(SvgArrowCornerCcwRt);
export default MemoSvgArrowCornerCcwRt;
