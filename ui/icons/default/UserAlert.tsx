import * as React from "react";

function SvgUserAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.75 7a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM10 2.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zM20.75 5a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0V5zM7 15.75A3.25 3.25 0 003.75 19c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25A3.25 3.25 0 0013 15.75H7zM2.25 19A4.75 4.75 0 017 14.25h6A4.75 4.75 0 0117.75 19 2.75 2.75 0 0115 21.75H5A2.75 2.75 0 012.25 19zM20 14a1 1 0 100-2 1 1 0 000 2z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgUserAlert = React.memo(SvgUserAlert);
export default MemoSvgUserAlert;
