import * as React from "react";

function SvgListOrdered(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.854 4.339A.75.75 0 014.25 5v4.25H5a.75.75 0 010 1.5H2a.75.75 0 010-1.5h.75V6.401l-.334.223a.75.75 0 01-.832-1.248l1.5-1a.75.75 0 01.77-.037zM8 5.249A.75.75 0 108 6.75h12a.75.75 0 000-1.5H8zM7.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H8a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H8a.75.75 0 01-.75-.75zM2 13.25a.75.75 0 000 1.5h2.25v1H2a.75.75 0 00-.75.75V19c0 .415.336.75.75.75h3a.75.75 0 100-1.5H2.75v-1H5a.75.75 0 00.75-.749V14a.75.75 0 00-.75-.75H2z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgListOrdered = React.memo(SvgListOrdered);
export default MemoSvgListOrdered;
