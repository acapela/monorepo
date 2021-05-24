import * as React from "react";

function SvgPaperclipSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.47 2.985a4.75 4.75 0 116.717 6.717l-1.742 1.743a.75.75 0 01-1.061-1.06l1.743-1.744a3.25 3.25 0 00-4.596-4.596l-1.743 1.743a.75.75 0 11-1.06-1.06l1.742-1.743zm10.253 7.778a.75.75 0 010 1.06l-2.475 2.475a.75.75 0 01-1.06-1.06l2.474-2.475a.75.75 0 011.06 0zm-6.364-4.95a.75.75 0 010 1.06l-1.743 1.743a.75.75 0 11-1.06-1.06l1.742-1.743a.75.75 0 011.06 0zM2.469 2.47a.75.75 0 011.061 0l4.758 4.757 2.828 2.829 2.829 2.828 2.828 2.829 4.757 4.757a.75.75 0 11-1.06 1.06l-4.227-4.227-2.298 2.299a6.75 6.75 0 11-9.546-9.546l2.298-2.298L2.47 3.53a.75.75 0 010-1.06zm5.288 6.348L5.46 11.116a5.25 5.25 0 007.425 7.425l2.298-2.298-1.768-1.768-2.298 2.298a2.75 2.75 0 01-3.889-3.889l2.298-2.298-1.768-1.768zm2.829 2.829l-2.298 2.298a1.25 1.25 0 101.768 1.767l2.298-2.298-1.768-1.767z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPaperclipSlash = React.memo(SvgPaperclipSlash);
export default MemoSvgPaperclipSlash;
