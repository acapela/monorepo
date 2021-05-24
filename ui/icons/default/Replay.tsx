import * as React from "react";

function SvgReplay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.493.435a.75.75 0 01.072 1.058l-1.57 1.801c.327-.029.661-.044 1.005-.044 5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 18.385 2.25 13c0-2.003.605-3.867 1.642-5.417a.75.75 0 111.247.834A8.25 8.25 0 1012 4.75c-.418 0-.82.026-1.207.074l2.15 1.57a.75.75 0 11-.885 1.212l-3.5-2.557a.75.75 0 01-.123-1.098l3-3.444a.75.75 0 011.058-.072z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgReplay = React.memo(SvgReplay);
export default MemoSvgReplay;
