import * as React from "react";

function SvgArrowsMove2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53 17.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72v-6.44h6.44l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72h-6.44V4.81l1.72 1.72a.75.75 0 101.06-1.06l-3-3a.75.75 0 00-1.06 0l-3 3a.75.75 0 001.06 1.06l1.72-1.72v6.44H4.81l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3a.75.75 0 000 1.06l3 3a.75.75 0 001.06-1.06l-1.72-1.72h6.44v6.44l-1.72-1.72z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowsMove2 = React.memo(SvgArrowsMove2);
export default MemoSvgArrowsMove2;
