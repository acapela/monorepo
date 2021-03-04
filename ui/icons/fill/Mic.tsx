import * as React from "react";

function SvgMic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="mic">
          <path d="M12 15a4 4 0 004-4V6a4 4 0 00-8 0v5a4 4 0 004 4z" />
          <path d="M19 11a1 1 0 00-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7 7 0 006 6.92V20H8.89a.89.89 0 00-.89.89v.22a.89.89 0 00.89.89h6.22a.89.89 0 00.89-.89v-.22a.89.89 0 00-.89-.89H13v-2.08A7 7 0 0019 11z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgMic;
