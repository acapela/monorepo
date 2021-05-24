import * as React from "react";

function SvgPharagraphSpacing(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 3A.75.75 0 014 2.25h16a.75.75 0 010 1.5H4A.75.75 0 013.25 3zm8.22 3.47a.75.75 0 011.06 0l2.5 2.5a.75.75 0 11-1.06 1.06l-1.22-1.22v6.38l1.22-1.22a.75.75 0 111.06 1.06l-2.5 2.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 111.06-1.06l1.22 1.22V8.81l-1.22 1.22a.75.75 0 11-1.06-1.06l2.5-2.5zM4 20.25a.75.75 0 000 1.5h16a.75.75 0 000-1.5H4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPharagraphSpacing = React.memo(SvgPharagraphSpacing);
export default MemoSvgPharagraphSpacing;
