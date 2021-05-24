import * as React from "react";

function SvgApperture(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.151 9.452A8.244 8.244 0 003.75 12c0 1.154.237 2.253.665 3.25H8.5l-2.09-2.786a.73.73 0 01-.02-.028L4.15 9.452zm6.224 5.798l-2.448-3.263 2.285-3.237h3.413l2.461 3.282-2.082 3.218h-3.629zm3.633-8H11.27l2.342-3.317a.735.735 0 00.015-.022 8.254 8.254 0 015.118 3.339h-4.738zm1.492 1.5l2.09 2.786.02.028 2.239 2.985c.26-.803.401-1.66.401-2.549a8.223 8.223 0 00-.665-3.25H15.5zM4.85 7.883a8.247 8.247 0 017.055-4.132l-4.923 6.975-2.133-2.844zm12.195 5.427l-4.478 6.92a8.25 8.25 0 006.584-4.113l-2.106-2.807zm-6.217 6.857a.743.743 0 01.042-.074l2.163-3.343H5.254a8.248 8.248 0 005.574 3.417zM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgApperture = React.memo(SvgApperture);
export default MemoSvgApperture;
