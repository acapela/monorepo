import * as React from "react";

function SvgSlidersVert2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75 3a.75.75 0 00-1.5 0v3.325A3.751 3.751 0 007 13.75a3.75 3.75 0 00.75-7.425V3zm-3 7a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zm3 6a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5zm10-13a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0V3zM17 16.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm.75 4.75v-3.325A3.751 3.751 0 0017 10.25a3.75 3.75 0 00-.75 7.425V21a.75.75 0 001.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSlidersVert2 = React.memo(SvgSlidersVert2);
export default MemoSvgSlidersVert2;
