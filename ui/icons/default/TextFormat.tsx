import * as React from "react";

function SvgTextFormat(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 2.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm-8 2h5.354c.259.916.98 1.637 1.896 1.896v10.708a2.756 2.756 0 00-1.896 1.896H6.646a2.756 2.756 0 00-1.896-1.896V6.646A2.756 2.756 0 006.646 4.75H12zm-5.354-1.5h10.708a2.751 2.751 0 113.396 3.396v10.708a2.751 2.751 0 11-3.396 3.396H6.646a2.751 2.751 0 11-3.396-3.396V6.646A2.751 2.751 0 116.646 3.25zM9 8.25a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0V9.75H15a.75.75 0 000-1.5H9zM18.75 20a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM4 18.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM2.75 4a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTextFormat = React.memo(SvgTextFormat);
export default MemoSvgTextFormat;
