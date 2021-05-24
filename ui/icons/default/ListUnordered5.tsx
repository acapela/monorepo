import * as React from "react";

function SvgListUnordered5(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.03 2.97a.75.75 0 00-1.06 1.06l.97.97-.97.97a.75.75 0 001.06 1.06L5 6.06l.97.97a.75.75 0 001.06-1.06L6.06 5l.97-.97a.75.75 0 00-1.06-1.06L5 3.94l-.97-.97zM10.25 5a.75.75 0 01.75-.75h10a.75.75 0 010 1.5H11a.75.75 0 01-.75-.75zm.75 6.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5H11zm0 7a.75.75 0 000 1.5h10a.75.75 0 000-1.5H11zM2.97 9.97a.75.75 0 011.06 0l.97.97.97-.97a.75.75 0 011.06 1.06l-.97.97.97.97a.75.75 0 11-1.06 1.06L5 13.06l-.97.97a.75.75 0 01-1.06-1.06l.97-.97-.97-.97a.75.75 0 010-1.06zm1.06 7a.75.75 0 00-1.06 1.06l.97.97-.97.97a.75.75 0 101.06 1.06l.97-.97.97.97a.75.75 0 001.06-1.06L6.06 19l.97-.97a.75.75 0 10-1.06-1.06l-.97.97-.97-.97z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgListUnordered5 = React.memo(SvgListUnordered5);
export default MemoSvgListUnordered5;
