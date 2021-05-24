import * as React from "react";

function SvgAlignCenter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4zM5.25 9A.75.75 0 016 8.25h12a.75.75 0 010 1.5H6A.75.75 0 015.25 9zM4 13.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4zm4 5a.75.75 0 000 1.5h8a.75.75 0 000-1.5H8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAlignCenter = React.memo(SvgAlignCenter);
export default MemoSvgAlignCenter;
