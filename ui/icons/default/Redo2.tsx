import * as React from "react";

function SvgRedo2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.744 11.095C4.977 9.177 7.194 7.25 11 7.25c2.81 0 5.497 1.938 7.387 3.702.724.675 1.356 1.35 1.863 1.928V8a.75.75 0 011.5 0v7a.75.75 0 01-.75.75h-7a.75.75 0 010-1.5h5.45a25.994 25.994 0 00-2.087-2.202C15.503 10.312 13.19 8.75 11 8.75c-3.193 0-4.977 1.573-5.994 3.156a9.167 9.167 0 00-1.262 3.192l-.001.008a.75.75 0 01-1.485-.212L3 15a67.602 67.602 0 01-.742-.107v-.003l.001-.007.003-.02.012-.072a10.042 10.042 0 01.275-1.107c.217-.701.586-1.643 1.195-2.59z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgRedo2 = React.memo(SvgRedo2);
export default MemoSvgRedo2;
