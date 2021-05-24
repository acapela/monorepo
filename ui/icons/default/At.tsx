import * as React from "react";

function SvgAt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 12a8.25 8.25 0 1116.5 0c0 .956-.126 1.79-.46 2.366-.294.505-.787.884-1.79.884-.406 0-.695-.156-.896-.393-.21-.25-.354-.631-.354-1.107V8a.75.75 0 00-1.5 0v.536a4.75 4.75 0 10.293 6.628c.108.238.246.46.415.661.488.577 1.198.925 2.042.925 1.497 0 2.504-.63 3.086-1.63.54-.929.664-2.094.664-3.12 0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12s4.365 9.75 9.75 9.75a9.713 9.713 0 004.334-1.014.75.75 0 10-.668-1.343A8.25 8.25 0 013.75 12zm11.5 0a3.25 3.25 0 10-6.5 0 3.25 3.25 0 006.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAt = React.memo(SvgAt);
export default MemoSvgAt;
