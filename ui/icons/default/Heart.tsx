import * as React from "react";

function SvgHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.438 6.975a3.969 3.969 0 10-5.676 5.55l7.1 7.26a.194.194 0 00.277 0l7.099-7.26a3.97 3.97 0 00-5.676-5.55l-1.026 1.05a.75.75 0 01-1.072 0l-1.026-1.05zM3.69 5.926a5.47 5.47 0 017.82 0l.49.501.49-.5a5.47 5.47 0 017.82 7.646l-7.099 7.26c-.664.68-1.758.68-2.422 0l-7.1-7.26a5.469 5.469 0 010-7.647z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgHeart = React.memo(SvgHeart);
export default MemoSvgHeart;
