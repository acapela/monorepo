import * as React from "react";

function SvgWheelchair(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM9.25 4a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0zM12 8.25a.75.75 0 01.75.75v2.25H18a.75.75 0 010 1.5h-5.25v2.5H18a.75.75 0 01.75.75v5.25H20a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75v-5.25H12a.75.75 0 01-.75-.75V9a.75.75 0 01.75-.75zM4.75 17A4.25 4.25 0 019 12.75a.75.75 0 000-1.5 5.75 5.75 0 104.6 9.2.75.75 0 10-1.2-.9A4.25 4.25 0 014.75 17z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgWheelchair = React.memo(SvgWheelchair);
export default MemoSvgWheelchair;
