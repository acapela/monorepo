import * as React from "react";

function SvgText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.955 3.25h10.09c.433 0 .83 0 1.152.043.356.048.731.16 1.04.47.31.309.422.684.47 1.04.043.323.043.72.043 1.152V6h-1.5c0-.493-.002-.787-.03-.997a.703.703 0 00-.042-.177l-.001-.003-.003-.001a.704.704 0 00-.177-.042c-.21-.028-.504-.03-.997-.03h-4.25v14.5H16a.75.75 0 010 1.5H8a.75.75 0 010-1.5h3.25V4.75H7c-.493 0-.787.002-.997.03a.706.706 0 00-.177.042l-.003.001-.001.003a.706.706 0 00-.042.177c-.028.21-.03.504-.03.997h-1.5v-.045c0-.433 0-.83.043-1.152.048-.356.16-.731.47-1.04.309-.31.684-.422 1.04-.47.323-.043.72-.043 1.152-.043z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgText = React.memo(SvgText);
export default MemoSvgText;
