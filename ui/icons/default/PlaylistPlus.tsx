import * as React from "react";

function SvgPlaylistPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.25 5A.75.75 0 013 4.25h16a.75.75 0 010 1.5H3A.75.75 0 012.25 5zm0 4A.75.75 0 013 8.25h12a.75.75 0 010 1.5H3A.75.75 0 012.25 9zM3 12.25a.75.75 0 000 1.5h8a.75.75 0 000-1.5H3zM2.25 17a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm16.5-3a.75.75 0 00-1.5 0v2.25H15a.75.75 0 000 1.5h2.25V20a.75.75 0 001.5 0v-2.25H21a.75.75 0 000-1.5h-2.25V14z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPlaylistPlus = React.memo(SvgPlaylistPlus);
export default MemoSvgPlaylistPlus;
