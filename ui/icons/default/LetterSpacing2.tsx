import * as React from "react";

function SvgLetterSpacing2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3.25a.75.75 0 000 1.5h3.25V12a.75.75 0 001.5 0V4.75H16a.75.75 0 000-1.5H8zm13.53 15.28a.75.75 0 000-1.06l-2.5-2.5a.75.75 0 10-1.06 1.06l1.22 1.22H4.81l1.22-1.22a.75.75 0 10-1.06-1.06l-2.5 2.5a.75.75 0 000 1.06l2.5 2.5a.75.75 0 001.06-1.06l-1.22-1.22h14.38l-1.22 1.22a.75.75 0 101.06 1.06l2.5-2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLetterSpacing2 = React.memo(SvgLetterSpacing2);
export default MemoSvgLetterSpacing2;
