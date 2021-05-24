import * as React from "react";

function SvgEmotionWow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM3.75 12a8.25 8.25 0 1116.5 0 8.25 8.25 0 01-16.5 0zM9 10a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-4 2.25A2.75 2.75 0 009.25 14v2a2.75 2.75 0 105.5 0v-2A2.75 2.75 0 0012 11.25zM10.75 14a1.25 1.25 0 112.5 0v2a1.25 1.25 0 11-2.5 0v-2z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgEmotionWow = React.memo(SvgEmotionWow);
export default MemoSvgEmotionWow;
