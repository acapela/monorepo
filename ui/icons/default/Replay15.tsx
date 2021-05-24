import * as React from "react";

function SvgReplay15(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.77 4.924C6.363 3.596 8.777 2.25 12 2.25A9.731 9.731 0 0121.75 12c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12a.75.75 0 011.5 0 8.25 8.25 0 0016.5 0A8.231 8.231 0 0012 3.75c-2.777 0-4.863 1.154-6.27 2.326a11.346 11.346 0 00-1.582 1.611 8.926 8.926 0 00-.502.694l-.003.005A.75.75 0 012.25 8V3.5a.75.75 0 011.5 0v2.372c.293-.303.633-.626 1.02-.948zM9 8.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V9A.75.75 0 019 8.25zm3 0a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h2.25v1.5H12a.75.75 0 000 1.5h3a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-2.25v-1.5H15a.75.75 0 000-1.5h-3z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgReplay15 = React.memo(SvgReplay15);
export default MemoSvgReplay15;
