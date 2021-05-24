import * as React from "react";

function SvgPenTool2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#pen-tool-2_svg__clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.156 2.267a.75.75 0 00-.89.89l3 14a.75.75 0 00.627.585l5.517.789a2.164 2.164 0 003.119 3l6.5-6.5a2.164 2.164 0 00-2.48-3.477l-.808-5.66a.75.75 0 00-.585-.627l-14-3zm14.047 10.468l-.873-6.111L6.325 4.266l4.333 4.333a2.75 2.75 0 11-1.06 1.06L5.264 5.326l2.358 11.005 6.111.873 4.47-4.47zM14.53 18.53l-1 1a.664.664 0 00.94.94l6.5-6.5a.664.664 0 00-.94-.94l-.5.5-5 5zm-2.53-8.78a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="pen-tool-2_svg__clip0">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

const MemoSvgPenTool2 = React.memo(SvgPenTool2);
export default MemoSvgPenTool2;
