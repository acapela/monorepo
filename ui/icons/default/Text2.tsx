import * as React from "react";

function SvgText2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 4A.75.75 0 015 3.25h14a.75.75 0 010 1.5h-6.25V20a.75.75 0 01-1.5 0V4.75H5A.75.75 0 014.25 4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgText2 = React.memo(SvgText2);
export default MemoSvgText2;
