import * as React from "react";

function SvgArrowCornerCcwLb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.944 2.25H20a.75.75 0 010 1.5h-3c-1.907 0-3.261.002-4.29.14-1.005.135-1.585.389-2.008.812-.423.423-.677 1.003-.812 2.009-.138 1.028-.14 2.382-.14 4.289v6.19l3.72-3.72a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-1.06 0l-5-5a.75.75 0 011.06-1.06l3.72 3.72v-6.246c0-1.838 0-3.294.153-4.433.158-1.172.49-2.121 1.238-2.87.749-.748 1.698-1.08 2.87-1.238 1.14-.153 2.595-.153 4.433-.153z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgArrowCornerCcwLb = React.memo(SvgArrowCornerCcwLb);
export default MemoSvgArrowCornerCcwLb;
