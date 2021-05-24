import * as React from "react";

function SvgPaperclip2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.75A3.25 3.25 0 006.75 6v10a5.25 5.25 0 1010.5 0V5a.75.75 0 011.5 0v11a6.75 6.75 0 01-13.5 0V6a4.75 4.75 0 019.5 0v10a2.75 2.75 0 11-5.5 0V6a.75.75 0 011.5 0v10a1.25 1.25 0 102.5 0V6A3.25 3.25 0 0010 2.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPaperclip2 = React.memo(SvgPaperclip2);
export default MemoSvgPaperclip2;
