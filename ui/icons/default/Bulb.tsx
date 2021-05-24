import * as React from "react";

function SvgBulb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 9a6.25 6.25 0 1110.785 4.3c-.801.845-1.644 1.898-2.045 3.135l-.12.07a6.883 6.883 0 01-.612.31c-.52.231-1.16.435-1.758.435-.599 0-1.237-.204-1.758-.435a6.853 6.853 0 01-.732-.38c-.401-1.237-1.244-2.29-2.046-3.135A6.226 6.226 0 015.75 9zm4 9.236c.596.254 1.406.514 2.25.514.845 0 1.654-.26 2.25-.514V19a2.25 2.25 0 01-4.5 0v-.764zM12 1.25a7.75 7.75 0 00-5.624 13.082c1.069 1.127 1.874 2.311 1.874 3.579V19a3.75 3.75 0 107.5 0v-1.09c0-1.267.805-2.45 1.874-3.578A7.75 7.75 0 0012 1.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBulb = React.memo(SvgBulb);
export default MemoSvgBulb;
