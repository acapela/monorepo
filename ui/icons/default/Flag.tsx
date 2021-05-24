import * as React from "react";

function SvgFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 1.25a.75.75 0 01.75.75v1.25H19a.75.75 0 01.696 1.029L17.808 9l1.888 4.722A.75.75 0 0119 14.75H5.75V22a.75.75 0 01-1.5 0V2A.75.75 0 015 1.25zm.75 12h12.142l-1.588-3.971a.75.75 0 010-.558l1.588-3.971H5.75v8.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFlag = React.memo(SvgFlag);
export default MemoSvgFlag;
