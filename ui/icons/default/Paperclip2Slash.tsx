import * as React from "react";

function SvgPaperclip2Slash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.75c-.825 0-1.576.306-2.15.812a.75.75 0 01-.992-1.124A4.75 4.75 0 0114.75 6v4a.75.75 0 01-1.5 0V6A3.25 3.25 0 0010 2.75zm-7.53-.28a.75.75 0 011.06 0l3 3 4 4 4 4 3.743 3.743 3.257 3.257a.75.75 0 11-1.06 1.06l-2.458-2.458A6.75 6.75 0 015.25 16V6.31L2.47 3.53a.75.75 0 010-1.06zm4.28 5.34V16a5.25 5.25 0 0010.13 1.94l-2.13-2.13V16a2.75 2.75 0 11-5.5 0v-5.69l-2.5-2.5zm4 4V16a1.25 1.25 0 102.5 0v-1.69l-2.5-2.5zM18 4.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V5a.75.75 0 01.75-.75zM9.25 6a.75.75 0 011.5 0v.5a.75.75 0 01-1.5 0V6z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPaperclip2Slash = React.memo(SvgPaperclip2Slash);
export default MemoSvgPaperclip2Slash;
