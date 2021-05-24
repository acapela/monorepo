import * as React from "react";

function SvgElements2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 6.5a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0zM6.5 2.25a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zm8.25 4.25a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0zm2.75-4.25a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zm0 12.5a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5zm-4.25 2.75a4.25 4.25 0 118.5 0 4.25 4.25 0 01-8.5 0zm-9.5 0a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0zm2.75-4.25a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgElements2 = React.memo(SvgElements2);
export default MemoSvgElements2;
