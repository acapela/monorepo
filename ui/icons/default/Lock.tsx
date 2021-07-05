import * as React from "react";

function SvgLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.8333 11.1667H6.16667C5.24619 11.1667 4.5 11.9129 4.5 12.8334V18.6667C4.5 19.5872 5.24619 20.3334 6.16667 20.3334H17.8333C18.7538 20.3334 19.5 19.5872 19.5 18.6667V12.8334C19.5 11.9129 18.7538 11.1667 17.8333 11.1667Z"
        stroke="#201F1F"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.83325 11.1667V7.83335C7.83325 6.72828 8.27224 5.66848 9.05364 4.88708C9.83504 4.10567 10.8948 3.66669 11.9999 3.66669C13.105 3.66669 14.1648 4.10567 14.9462 4.88708C15.7276 5.66848 16.1666 6.72828 16.1666 7.83335V11.1667"
        stroke="#201F1F"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
const MemoSvgLock = React.memo(SvgLock);
export default MemoSvgLock;
