import * as React from "react";

function SvgStarSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.47 1.47a.75.75 0 011.06 0L8.76 7.7l9.156 9.156 4.614 4.614a.75.75 0 11-1.06 1.06l-2.777-2.777.038.171a.75.75 0 01-1.074.833L12 17.844l-5.657 2.913a.75.75 0 01-1.074-.833l1.408-6.202-4.206-4.19a.75.75 0 01.42-1.274l3.754-.553L1.47 2.53a.75.75 0 010-1.06zm6.496 7.557l-3.377.497 3.44 3.428a.75.75 0 01.202.697l-1.143 5.037 4.569-2.353a.75.75 0 01.686 0l4.57 2.353-.21-.923-8.737-8.736zM12 1.25a.75.75 0 01.673.42L15.5 7.432l5.61.826a.75.75 0 01.42 1.273l-4 3.986a.75.75 0 01-1.06-1.063l2.941-2.93-4.52-.665a.75.75 0 01-.564-.412L12 3.703 10.711 6.33a.75.75 0 11-1.346-.66l1.962-4A.75.75 0 0112 1.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgStarSlash = React.memo(SvgStarSlash);
export default MemoSvgStarSlash;
