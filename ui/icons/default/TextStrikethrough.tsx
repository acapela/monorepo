import * as React from "react";

function SvgTextStrikethrough(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.25 8A4.75 4.75 0 0111 3.25h2A4.75 4.75 0 0117.75 8a.75.75 0 01-1.5 0A3.25 3.25 0 0013 4.75h-2a3.25 3.25 0 00-3.148 4.063.75.75 0 11-1.453.374A4.757 4.757 0 016.25 8zm-4 4a.75.75 0 01.75-.75h18a.75.75 0 010 1.5h-4.536a4.75 4.75 0 01-3.464 8h-2A4.75 4.75 0 016.25 16a.75.75 0 011.5 0A3.25 3.25 0 0011 19.25h2a3.25 3.25 0 000-6.5H3a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTextStrikethrough = React.memo(SvgTextStrikethrough);
export default MemoSvgTextStrikethrough;
