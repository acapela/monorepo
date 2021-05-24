import * as React from "react";

function SvgSpecialCharachers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.75a8.25 8.25 0 00-3.783 15.584.75.75 0 01-.344 1.416H3a.75.75 0 010-1.5h2.48A9.726 9.726 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75a9.726 9.726 0 01-3.23 7.25H21a.75.75 0 010 1.5h-4.873a.75.75 0 01-.344-1.416A8.25 8.25 0 0012 3.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSpecialCharachers = React.memo(SvgSpecialCharachers);
export default MemoSvgSpecialCharachers;
