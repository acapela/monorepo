import * as React from "react";

function SvgForwardAll(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.53 4.47a.75.75 0 10-1.06 1.06l3.72 3.72h-5.232c-1.369 0-2.454 0-3.32.088-.888.09-1.629.28-2.277.713a4.751 4.751 0 00-1.31 1.31c-.434.648-.623 1.39-.713 2.277-.088.866-.088 1.951-.088 3.32V17h1.5c0-1.42 0-2.429.08-3.21.079-.77.227-1.235.468-1.596a3.25 3.25 0 01.896-.896c.361-.241.827-.39 1.596-.468.781-.08 1.79-.08 3.21-.08h5.19l-3.72 3.72a.75.75 0 101.06 1.06l5-5a.75.75 0 000-1.06l-5-5zm4 0a.75.75 0 10-1.06 1.06L20.94 10l-4.47 4.47a.75.75 0 101.06 1.06l5-5a.75.75 0 000-1.06l-5-5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgForwardAll = React.memo(SvgForwardAll);
export default MemoSvgForwardAll;
