import * as React from "react";

function SvgWifi(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.232 11.047A13.213 13.213 0 0112 6.75c3.866 0 7.344 1.655 9.767 4.297a.75.75 0 101.106-1.014A14.713 14.713 0 0012 5.25a14.713 14.713 0 00-10.873 4.783.75.75 0 101.105 1.014zm3.429 2.217A9.215 9.215 0 0112 10.75c2.454 0 4.683.954 6.34 2.514a.75.75 0 101.027-1.092A10.716 10.716 0 0012 9.25c-2.851 0-5.444 1.11-7.368 2.922a.75.75 0 001.029 1.092zM12 14.75c-1.3 0-2.488.471-3.405 1.253a.75.75 0 11-.973-1.14A6.726 6.726 0 0112 13.25c1.67 0 3.2.607 4.378 1.612a.75.75 0 01-.973 1.141A5.226 5.226 0 0012 14.75zM12 19a1 1 0 100-2 1 1 0 000 2z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgWifi = React.memo(SvgWifi);
export default MemoSvgWifi;
