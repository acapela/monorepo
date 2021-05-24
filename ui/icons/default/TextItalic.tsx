import * as React from "react";

function SvgTextItalic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.016 3.25H19a.75.75 0 010 1.5h-4.415l-3.625 14.5H15a.75.75 0 010 1.5H5a.75.75 0 110-1.5h4.414l3.625-14.5H9a.75.75 0 110-1.5h5.016z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTextItalic = React.memo(SvgTextItalic);
export default MemoSvgTextItalic;
