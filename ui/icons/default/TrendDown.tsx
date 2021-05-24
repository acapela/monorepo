import * as React from "react";

function SvgTrendDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.47 6.47a.75.75 0 011.06 0l4 4c.588.588.759.744.915.822.35.173.76.173 1.11 0 .156-.078.327-.234.915-.822l.085-.086c.46-.461.817-.818 1.224-1.02a2.75 2.75 0 012.442 0c.407.202.763.559 1.223 1.02l.086.086 4.72 4.72V11a.75.75 0 011.5 0v6a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h4.19l-4.72-4.72c-.588-.588-.759-.744-.915-.822a1.25 1.25 0 00-1.11 0c-.156.078-.327.234-.915.822l-.085.086c-.46.461-.817.818-1.224 1.02a2.75 2.75 0 01-2.442 0c-.407-.202-.763-.559-1.224-1.02l-.085-.086-4-4a.75.75 0 010-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTrendDown = React.memo(SvgTrendDown);
export default MemoSvgTrendDown;
