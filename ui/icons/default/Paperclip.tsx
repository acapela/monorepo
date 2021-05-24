import * as React from "react";

function SvgPaperclip(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.127 4.045a3.25 3.25 0 00-4.596 0L5.46 11.116a5.25 5.25 0 007.424 7.425l7.778-7.778a.75.75 0 111.061 1.06l-7.778 7.779a6.75 6.75 0 11-9.546-9.546l7.071-7.071a4.75 4.75 0 116.717 6.717l-7.07 7.071a2.75 2.75 0 01-3.89-3.889l7.071-7.071a.75.75 0 011.061 1.06l-7.071 7.072a1.25 1.25 0 101.768 1.767l7.07-7.07a3.25 3.25 0 000-4.597z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPaperclip = React.memo(SvgPaperclip);
export default MemoSvgPaperclip;
