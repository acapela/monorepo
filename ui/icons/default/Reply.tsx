import * as React from "react";

function SvgReply(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53 4.47a.75.75 0 010 1.06L5.81 9.25h7.232c1.369 0 2.454 0 3.32.088.888.09 1.629.28 2.277.713.519.346.964.791 1.31 1.31.434.648.623 1.39.713 2.277.088.866.088 1.951.088 3.32V17h-1.5c0-1.42 0-2.429-.08-3.21-.079-.77-.227-1.235-.468-1.596a3.249 3.249 0 00-.896-.896c-.361-.241-.827-.39-1.596-.468-.781-.08-1.79-.08-3.21-.08H5.81l3.72 3.72a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.06 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgReply = React.memo(SvgReply);
export default MemoSvgReply;
