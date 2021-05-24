import * as React from "react";

function SvgLetterSpacing(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 3.25a.75.75 0 01.75.75v16a.75.75 0 01-1.5 0V4A.75.75 0 012 3.25zm20 0a.75.75 0 01.75.75v16a.75.75 0 01-1.5 0V4a.75.75 0 01.75-.75zm-9.33 4.415a.75.75 0 00-1.34 0l-2.5 5-1.5 3a.75.75 0 101.34.67l1.294-2.585h4.072l1.293 2.585a.75.75 0 101.342-.67l-1.5-3-2.5-5zM12 9.677l1.287 2.573h-2.574L12 9.677z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLetterSpacing = React.memo(SvgLetterSpacing);
export default MemoSvgLetterSpacing;
