import * as React from "react";

function SvgReplyAll(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.53 5.53a.75.75 0 10-1.06-1.06l-5 5a.75.75 0 000 1.06l5 5a.75.75 0 001.06-1.06L5.06 10l4.47-4.47zm4 0a.75.75 0 10-1.06-1.06l-5 5a.75.75 0 000 1.06l5 5a.75.75 0 001.06-1.06l-3.72-3.72H15c1.42 0 2.429 0 3.21.08.77.079 1.235.227 1.596.468.355.237.66.541.896.896.241.361.39.827.468 1.596.08.781.08 1.79.08 3.21h1.5v-.042c0-1.369 0-2.454-.088-3.32-.09-.888-.28-1.629-.712-2.277a4.75 4.75 0 00-1.31-1.31c-.65-.434-1.39-.623-2.278-.713-.866-.088-1.951-.088-3.32-.088H9.81l3.72-3.72z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgReplyAll = React.memo(SvgReplyAll);
export default MemoSvgReplyAll;
