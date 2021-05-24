import * as React from "react";

function SvgBed1(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 4.25a.75.75 0 01.75.75v7.25h8.5V7a.75.75 0 01.75-.75h4.055c1.367 0 2.47 0 3.337.117.9.12 1.658.38 2.26.981.602.602.86 1.36.982 2.26.116.867.116 1.97.116 3.337V19a.75.75 0 01-1.5 0v-5.25H2.75V19a.75.75 0 01-1.5 0V5A.75.75 0 012 4.25zm19.25 8h-8.5v-4.5H16c1.435 0 2.436.002 3.192.103.734.099 1.122.28 1.399.556.277.277.457.665.556 1.4.083.615.099 1.395.102 2.441zM5.75 8a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM7 5.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBed1 = React.memo(SvgBed1);
export default MemoSvgBed1;
