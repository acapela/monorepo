import * as React from "react";

function SvgBluetooth(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.695 2.315a.75.75 0 01.807.128l5 4.5a.75.75 0 010 1.114L13.122 12l4.38 3.943a.75.75 0 010 1.115l-5 4.5A.75.75 0 0111.25 21v-7.19l-3.72 3.72a.75.75 0 01-1.06-1.06L10.94 12 6.47 7.53a.75.75 0 011.06-1.06l3.72 3.72V3a.75.75 0 01.445-.685zm1.055 11.369v5.632l3.129-2.816-3.129-2.816zm0-3.368V4.684L15.879 7.5l-3.129 2.816z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBluetooth = React.memo(SvgBluetooth);
export default MemoSvgBluetooth;
