import * as React from "react";

function SvgSmallCaps2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 3.25a.75.75 0 000 1.5h6.25V20a.75.75 0 001.5 0V4.75H16a.75.75 0 000-1.5H2zm12 8a.75.75 0 000 1.5h3.25V20a.75.75 0 001.5 0v-7.25H22a.75.75 0 000-1.5h-8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSmallCaps2 = React.memo(SvgSmallCaps2);
export default MemoSvgSmallCaps2;
