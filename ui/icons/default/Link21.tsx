import * as React from "react";

function SvgLink21(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.601 4.399a5.75 5.75 0 00-8.131 0l-.707.707a.75.75 0 001.06 1.06l.707-.707a4.25 4.25 0 016.01 6.01l-1.685 1.687a3.865 3.865 0 01-5.467 0l-.272-.272a.75.75 0 10-1.06 1.06l.271.273a5.365 5.365 0 007.588 0l1.686-1.687a5.75 5.75 0 000-8.131zM7.146 10.844a3.865 3.865 0 015.466 0l.272.272a.75.75 0 001.06-1.06l-.271-.272a5.365 5.365 0 00-7.588 0L4.399 11.47a5.75 5.75 0 108.131 8.132l.708-.708a.75.75 0 10-1.061-1.06l-.707.707a4.25 4.25 0 01-6.01-6.01l1.686-1.687z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLink21 = React.memo(SvgLink21);
export default MemoSvgLink21;
