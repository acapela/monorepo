import * as React from "react";

function SvgHashtagCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.843-4.744a.75.75 0 01.651.837l-.207 1.657h1.488l.23-1.843a.75.75 0 111.49.186l-.208 1.657H16a.75.75 0 010 1.5h-1.65l-.188 1.5H15.5a.75.75 0 010 1.5h-1.525l-.23 1.843a.75.75 0 01-1.49-.186l.208-1.657h-1.488l-.23 1.843a.75.75 0 01-1.49-.186l.208-1.657H8a.75.75 0 010-1.5h1.65l.188-1.5H8.5a.75.75 0 010-1.5h1.525l.23-1.843a.75.75 0 01.838-.651zm.07 5.494h1.487l.188-1.5H11.35l-.188 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgHashtagCircle = React.memo(SvgHashtagCircle);
export default MemoSvgHashtagCircle;
