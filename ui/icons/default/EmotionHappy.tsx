import * as React from "react";

function SvgEmotionHappy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM3.75 12a8.25 8.25 0 1116.5 0 8.25 8.25 0 01-16.5 0zm3.25.25a.75.75 0 00-.716.974L7 13l-.716.224v.001l.001.002.002.005.004.013a3.235 3.235 0 00.069.193 8.016 8.016 0 001.143 2.024c.87 1.113 2.316 2.288 4.497 2.288s3.628-1.175 4.497-2.288a8.02 8.02 0 001.197-2.173l.008-.024.007-.02.004-.013.002-.005v-.002L17 13l.716.224A.75.75 0 0017 12.25H7zm1.685 2.288a6.329 6.329 0 01-.524-.788h7.678c-.14.247-.313.518-.524.788-.693.887-1.746 1.712-3.315 1.712s-2.622-.825-3.315-1.712zM10 9a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgEmotionHappy = React.memo(SvgEmotionHappy);
export default MemoSvgEmotionHappy;
