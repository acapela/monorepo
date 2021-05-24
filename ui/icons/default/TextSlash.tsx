import * as React from "react";

function SvgTextSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 4.75c.493 0 .787.002.997.03a.704.704 0 01.177.042l.003.001.001.003a.703.703 0 01.042.177c.028.21.03.504.03.997h1.5v-.045c0-.433 0-.83-.043-1.152-.048-.356-.16-.731-.47-1.04-.309-.31-.684-.422-1.04-.47-.323-.043-.72-.043-1.152-.043H8.5a.75.75 0 100 1.5h2.75V8a.75.75 0 001.5 0V4.75H17zm-4.25 9.06v5.44H16a.75.75 0 010 1.5H8a.75.75 0 010-1.5h3.25v-6.94L3.47 4.53a.75.75 0 011.06-1.06l16 16a.75.75 0 11-1.06 1.06l-6.72-6.72z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTextSlash = React.memo(SvgTextSlash);
export default MemoSvgTextSlash;
