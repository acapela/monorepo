import * as React from "react";

function SvgSend2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.53 2.47c.201.2.272.498.182.767l-6 18a.75.75 0 01-1.383.098L9.441 13.56 1.665 9.671a.75.75 0 01.098-1.382l18-6a.75.75 0 01.768.18zm-9.617 10.678l2.948 5.897 4.953-14.86L3.954 9.14l5.898 2.949L12.97 8.97a.75.75 0 111.06 1.06l-3.117 3.118z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSend2 = React.memo(SvgSend2);
export default MemoSvgSend2;
