import * as React from "react";

function SvgSend(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.458 3.482a.75.75 0 01.847-.167l18 8a.75.75 0 010 1.37l-18 8a.75.75 0 01-.976-1.02L6.161 12 2.33 4.335a.75.75 0 01.129-.853zm5.006 9.268l-2.858 5.716L19.153 12 4.606 5.534l2.858 5.716H12a.75.75 0 010 1.5H7.464z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSend = React.memo(SvgSend);
export default MemoSvgSend;
