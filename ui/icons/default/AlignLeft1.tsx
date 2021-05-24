import * as React from "react";

function SvgAlignLeft1(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4zM3.25 9A.75.75 0 014 8.25h12a.75.75 0 010 1.5H4A.75.75 0 013.25 9zM4 13.25a.75.75 0 000 1.5h14a.75.75 0 000-1.5H4zm0 5a.75.75 0 000 1.5h8a.75.75 0 000-1.5H4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAlignLeft1 = React.memo(SvgAlignLeft1);
export default MemoSvgAlignLeft1;
