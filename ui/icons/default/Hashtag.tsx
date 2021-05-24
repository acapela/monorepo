import * as React from "react";

function SvgHashtag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.745 3.083a.75.75 0 10-1.49-.166L8.662 8.25H3a.75.75 0 000 1.5h5.495l-.5 4.5H2a.75.75 0 000 1.5h5.829l-.574 5.167a.75.75 0 001.49.166l.593-5.333h4.49l-.573 5.167a.75.75 0 001.49.166l.593-5.333H20a.75.75 0 000-1.5h-4.495l.5-4.5H21a.75.75 0 000-1.5h-4.829l.574-5.167a.75.75 0 10-1.49-.166l-.593 5.333h-4.49l.573-5.167zm3.25 11.167l.5-4.5h-4.49l-.5 4.5h4.49z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgHashtag = React.memo(SvgHashtag);
export default MemoSvgHashtag;
