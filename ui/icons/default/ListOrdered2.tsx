import * as React from "react";

function SvgListOrdered2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 2.25a.75.75 0 100 1.5h.25v2.5H5a.75.75 0 000 1.5h2a.75.75 0 000-1.5h-.25V3A.75.75 0 006 2.25H5zM10.25 5a.75.75 0 01.75-.75h10a.75.75 0 110 1.5H11a.75.75 0 01-.75-.75zm.75 6.25a.75.75 0 000 1.5h10a.75.75 0 100-1.5H11zm0 7a.75.75 0 000 1.5h10a.75.75 0 100-1.5H11zM4.25 10A.75.75 0 015 9.25h2a.75.75 0 01.67 1.085L6.215 13.25H7a.75.75 0 010 1.5H5a.75.75 0 01-.67-1.085l1.456-2.915H5a.75.75 0 01-.75-.75zM5 16.25a.75.75 0 000 1.5h1.25v.5H5a.75.75 0 000 1.5h1.25v.5H5a.75.75 0 000 1.5h2a.75.75 0 00.75-.75v-4a.75.75 0 00-.75-.75H5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgListOrdered2 = React.memo(SvgListOrdered2);
export default MemoSvgListOrdered2;
