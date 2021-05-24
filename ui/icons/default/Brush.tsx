import * as React from "react";

function SvgBrush(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.99 1.25a2.74 2.74 0 00-2.74 2.74v6.93c0 1.554.815 2.994 2.147 3.793l1.642.985a1.948 1.948 0 01.92 1.99l-.206 1.23a3.291 3.291 0 106.494 0l-.205-1.23a1.948 1.948 0 01.919-1.99l1.642-.985a4.423 4.423 0 002.147-3.793V3.99a2.74 2.74 0 00-2.74-2.74H6.99zm11.26 8V3.99a1.24 1.24 0 00-1.24-1.24h-3.26V4a.75.75 0 01-1.5 0V2.75h-2.5V6a.75.75 0 01-1.5 0V2.75H6.99a1.24 1.24 0 00-1.24 1.24v5.26h12.5zm-12.5 1.5h12.5v.17a2.923 2.923 0 01-1.42 2.507l-1.64.985a3.448 3.448 0 00-1.628 3.523l.205 1.23a1.791 1.791 0 11-3.534 0l.205-1.23a3.448 3.448 0 00-1.627-3.523l-1.642-.985A2.923 2.923 0 015.75 10.92v-.17z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBrush = React.memo(SvgBrush);
export default MemoSvgBrush;
