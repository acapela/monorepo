import * as React from "react";

function SvgMic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.25A3.75 3.75 0 008.25 5v7a3.75 3.75 0 107.5 0V5A3.75 3.75 0 0012 1.25zM9.75 5a2.25 2.25 0 014.5 0v7a2.25 2.25 0 01-4.5 0V5zm-4 7a.75.75 0 00-1.5 0c0 2.725 1.1 4.688 2.65 5.956 1.3 1.063 2.888 1.617 4.35 1.758V22a.75.75 0 001.5 0v-2.287c1.462-.14 3.05-.694 4.35-1.758 1.55-1.267 2.65-3.23 2.65-5.955a.75.75 0 00-1.5 0c0 2.275-.9 3.812-2.1 4.794-1.224 1.002-2.8 1.456-4.15 1.456-1.35 0-2.926-.454-4.15-1.456-1.2-.982-2.1-2.519-2.1-4.794z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMic = React.memo(SvgMic);
export default MemoSvgMic;
