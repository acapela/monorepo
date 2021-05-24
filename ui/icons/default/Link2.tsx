import * as React from "react";

function SvgLink2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 4A.75.75 0 014 3.25h16a.75.75 0 01.75.75v16a.75.75 0 01-.75.75H4a.75.75 0 01-.75-.75V4zm1.5.75v6.5h6.5v-6.5h-6.5zm8 0v6.5h6.5v-6.5h-6.5zm6.5 8h-6.5v6.5h6.5v-6.5zm-8 6.5v-6.5h-6.5v6.5h6.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLink2 = React.memo(SvgLink2);
export default MemoSvgLink2;
