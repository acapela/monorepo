import * as React from "react";

function SvgTextSlash2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.25H8.5a.75.75 0 000 1.5h2.75V8a.75.75 0 001.5 0V4.75H19a.75.75 0 000-1.5h-7zm.75 10.56V20a.75.75 0 01-1.5 0v-7.69L3.47 4.53a.75.75 0 011.06-1.06l16 16a.75.75 0 11-1.06 1.06l-6.72-6.72z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTextSlash2 = React.memo(SvgTextSlash2);
export default MemoSvgTextSlash2;
