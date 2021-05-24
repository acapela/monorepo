import * as React from "react";

function SvgBulbSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.53 1.47a.75.75 0 00-1.06 1.06L4.878 5.94A7.727 7.727 0 004.25 9c0 2.066.81 3.944 2.126 5.332 1.069 1.127 1.874 2.311 1.874 3.579V19a3.75 3.75 0 107.5 0v-1.09c0-.32.052-.638.148-.952l5.572 5.572a.75.75 0 101.06-1.06l-6.342-6.343-9.876-9.875L2.53 1.47zM5.75 9c0-.662.103-1.299.293-1.897L14.74 15.8a5.733 5.733 0 00-.25.635l-.12.07a6.883 6.883 0 01-.612.31c-.52.231-1.16.435-1.758.435-.599 0-1.237-.204-1.758-.435a6.853 6.853 0 01-.732-.38c-.401-1.237-1.244-2.29-2.046-3.135A6.226 6.226 0 015.75 9zm4 9.236c.596.254 1.406.514 2.25.514.845 0 1.654-.26 2.25-.514V19a2.25 2.25 0 01-4.5 0v-.764zM8.43 3.87a6.25 6.25 0 018.701 8.701.75.75 0 101.23.858A7.75 7.75 0 007.57 2.64a.75.75 0 10.858 1.23z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBulbSlash = React.memo(SvgBulbSlash);
export default MemoSvgBulbSlash;
