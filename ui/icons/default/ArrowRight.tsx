import * as React from "react";

function SvgArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.47 5.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H5a.75.75 0 010-1.5h12.19l-4.72-4.72a.75.75 0 010-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowRight = React.memo(SvgArrowRight);
export default MemoSvgArrowRight;
