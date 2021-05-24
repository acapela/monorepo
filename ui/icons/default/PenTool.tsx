import * as React from "react";

function SvgPenTool(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.639.607a.75.75 0 00-1.278 0l-8 13a.75.75 0 00.053.862l3.178 3.972A2.25 2.25 0 007.5 22.75h9a2.25 2.25 0 00.908-4.31l3.178-3.972a.75.75 0 00.053-.861l-8-13zm3.354 19.143h.507a.75.75 0 010 1.5h-9a.75.75 0 010-1.5h8.493zm-.354-1.5l3.446-4.306L12.75 3.65v5.704a2.751 2.751 0 11-1.5 0V3.65L4.915 13.944 8.36 18.25h7.28zM12 10.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPenTool = React.memo(SvgPenTool);
export default MemoSvgPenTool;
