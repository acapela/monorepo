import * as React from "react";

function SvgUndo2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 7.25a.75.75 0 01.75.75v4.88a27.053 27.053 0 011.863-1.928C7.503 9.188 10.19 7.25 13 7.25c3.806 0 6.023 1.927 7.256 3.845a10.66 10.66 0 011.47 3.696l.012.071.003.021v.007l.001.002v.001L21 15l.742-.106a.75.75 0 01-1.484.214v-.001l-.002-.01a8.528 8.528 0 00-.238-.97 9.168 9.168 0 00-1.024-2.221C17.977 10.323 16.194 8.75 13 8.75c-2.19 0-4.503 1.562-6.363 3.298A25.981 25.981 0 004.55 14.25H10a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75V8A.75.75 0 013 7.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgUndo2 = React.memo(SvgUndo2);
export default MemoSvgUndo2;
