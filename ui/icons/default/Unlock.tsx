import React from "react";

function SvgUnlock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.8333 11.1667H6.16667C5.24619 11.1667 4.5 11.9129 4.5 12.8334V18.6667C4.5 19.5872 5.24619 20.3334 6.16667 20.3334H17.8333C18.7538 20.3334 19.5 19.5872 19.5 18.6667V12.8334C19.5 11.9129 18.7538 11.1667 17.8333 11.1667Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.83325 11.1667V7.83334C7.83222 6.80005 8.21515 5.80323 8.90773 5.03639C9.60031 4.26956 10.5531 3.78742 11.5812 3.68358C12.6092 3.57974 13.6392 3.86159 14.4711 4.47443C15.3031 5.08728 15.8776 5.98738 16.0833 7.00001"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoSvgUnlock = React.memo(SvgUnlock);
export default MemoSvgUnlock;
