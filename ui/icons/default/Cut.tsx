import * as React from "react";

function SvgCut(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.555 2.495a.75.75 0 00-1.11 1.01l4 4.4a.75.75 0 001.11-1.01l-4-4.4zm12 1.01a.75.75 0 00-1.11-1.01l-6 6.6-4 4.4a.747.747 0 00-.027.032 3.75 3.75 0 101.258.845L12 10.715l3.325 3.657a3.75 3.75 0 101.258-.845.818.818 0 00-.028-.032L13.014 9.6l5.541-6.095zM18 14.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-12 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCut = React.memo(SvgCut);
export default MemoSvgCut;
