import * as React from "react";

function SvgAlignTop2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4zm8.53 5.22a.75.75 0 00-1.06 0l-4 4a.75.75 0 101.06 1.06l2.72-2.72V21a.75.75 0 001.5 0V9.81l2.72 2.72a.75.75 0 101.06-1.06l-4-4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAlignTop2 = React.memo(SvgAlignTop2);
export default MemoSvgAlignTop2;
