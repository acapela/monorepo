import * as React from "react";

function SvgTransform(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.75 5a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm-1.396-.75a2.751 2.751 0 113.396 3.396v8.707a2.751 2.751 0 11-3.396 3.397H7.646a2.751 2.751 0 11-3.396-3.396V7.646A2.751 2.751 0 117.646 4.25h8.707zM5.75 16.354c.916.259 1.637.98 1.896 1.896h8.707a2.756 2.756 0 011.897-1.896V7.646a2.756 2.756 0 01-1.896-1.896H7.646A2.756 2.756 0 015.75 7.646v8.707zM19 17.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-14-14a1.25 1.25 0 000 2.5 1.25 1.25 0 000-2.5zM3.75 19a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTransform = React.memo(SvgTransform);
export default MemoSvgTransform;
