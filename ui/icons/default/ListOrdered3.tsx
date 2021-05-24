import * as React from "react";

function SvgListOrdered3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.854 4.339A.75.75 0 016.25 5v4.25H7a.75.75 0 010 1.5H4a.75.75 0 010-1.5h.75V6.401l-.334.223a.75.75 0 01-.832-1.248l1.5-1a.75.75 0 01.77-.037zM11 4.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5H11zM10.25 12a.75.75 0 01.75-.75h10a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm0 7a.75.75 0 01.75-.75h10a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zM4 13.25a.75.75 0 000 1.5h2.25v1H4a.75.75 0 00-.75.75V19c0 .414.336.75.75.75h3a.75.75 0 100-1.5H4.75v-1H7a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgListOrdered3 = React.memo(SvgListOrdered3);
export default MemoSvgListOrdered3;
