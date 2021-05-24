import * as React from "react";

function SvgImport3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 12A8.25 8.25 0 0112 3.75a.75.75 0 000-1.5c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75a.75.75 0 00-1.5 0 8.25 8.25 0 01-16.5 0zm15.78-6.47a.75.75 0 00-1.06-1.06l-7.72 7.72V9a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h5a.75.75 0 000-1.5h-3.19l7.72-7.72z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgImport3 = React.memo(SvgImport3);
export default MemoSvgImport3;
