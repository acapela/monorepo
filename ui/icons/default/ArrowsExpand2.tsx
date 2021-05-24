import * as React from "react";

function SvgArrowsExpand2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 3.25a.75.75 0 000 1.5h3.19L12 10.94 5.81 4.75H9a.75.75 0 000-1.5H4a.75.75 0 00-.75.75v5a.75.75 0 001.5 0V5.81L10.94 12l-6.19 6.19V15a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h5a.75.75 0 000-1.5H5.81L12 13.06l6.19 6.19H15a.75.75 0 000 1.5h5a.75.75 0 00.75-.75v-5a.75.75 0 00-1.5 0v3.19L13.06 12l6.19-6.19V9a.75.75 0 001.5 0V4a.75.75 0 00-.75-.75h-5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowsExpand2 = React.memo(SvgArrowsExpand2);
export default MemoSvgArrowsExpand2;
