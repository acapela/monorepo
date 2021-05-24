import * as React from "react";

function SvgFlag2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 1.25a.75.75 0 01.75.75v1.085l1.74-.348a6.983 6.983 0 014.962.86 5.483 5.483 0 005.273.202l.94-.47A.75.75 0 0119.75 4v10a.75.75 0 01-.415.67l-.94.47a6.983 6.983 0 01-6.715-.257 5.483 5.483 0 00-3.896-.675l-2.034.407V22a.75.75 0 01-1.5 0V2A.75.75 0 015 1.25zm.75 11.835l1.74-.348a6.983 6.983 0 014.962.86 5.483 5.483 0 005.273.202l.525-.262V5.21a6.983 6.983 0 01-6.57-.328 5.483 5.483 0 00-3.896-.675l-2.034.407v8.47z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFlag2 = React.memo(SvgFlag2);
export default MemoSvgFlag2;
