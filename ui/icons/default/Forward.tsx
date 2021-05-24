import * as React from "react";

function SvgForward(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.47 4.47a.75.75 0 011.06 0l5 5a.75.75 0 010 1.06l-5 5a.75.75 0 11-1.06-1.06l3.72-3.72H11c-1.42 0-2.429 0-3.21.08-.77.079-1.235.227-1.596.468a3.25 3.25 0 00-.896.896c-.241.361-.39.827-.468 1.596-.08.781-.08 1.79-.08 3.21h-1.5v-.042c0-1.369 0-2.454.088-3.32.09-.888.28-1.629.713-2.277a4.751 4.751 0 011.31-1.31c.648-.434 1.39-.623 2.277-.713.866-.088 1.951-.088 3.32-.088h7.232l-3.72-3.72a.75.75 0 010-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgForward = React.memo(SvgForward);
export default MemoSvgForward;
