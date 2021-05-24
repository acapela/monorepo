import * as React from "react";

function SvgAlignBottom2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.75 3a.75.75 0 00-1.5 0v11.19l-2.72-2.72a.75.75 0 00-1.06 1.06l4 4a.75.75 0 001.06 0l4-4a.75.75 0 10-1.06-1.06l-2.72 2.72V3zM4 20.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAlignBottom2 = React.memo(SvgAlignBottom2);
export default MemoSvgAlignBottom2;
