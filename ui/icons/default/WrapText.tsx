import * as React from "react";

function SvgWrapText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4zm13.5 8.5H4a.75.75 0 010-1.5h13.5a4.25 4.25 0 010 8.5h-3.69l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 111.06 1.06l-1.72 1.72h3.69a2.75 2.75 0 100-5.5zM3.25 18a.75.75 0 01.75-.75h4a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgWrapText = React.memo(SvgWrapText);
export default MemoSvgWrapText;
