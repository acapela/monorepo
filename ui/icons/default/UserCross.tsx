import * as React from "react";

function SvgUserCross(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 3.75a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5zM4.25 7a4.75 4.75 0 119.5 0 4.75 4.75 0 01-9.5 0zM6 15.75A3.25 3.25 0 002.75 19c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25A3.25 3.25 0 0012 15.75H6zM1.25 19A4.75 4.75 0 016 14.25h6A4.75 4.75 0 0116.75 19 2.75 2.75 0 0114 21.75H4A2.75 2.75 0 011.25 19zM18.53 6.47a.75.75 0 10-1.06 1.06l1.97 1.97-1.97 1.97a.75.75 0 101.06 1.06l1.97-1.97 1.97 1.97a.75.75 0 101.06-1.06L21.56 9.5l1.97-1.97a.75.75 0 00-1.06-1.06L20.5 8.44l-1.97-1.97z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgUserCross = React.memo(SvgUserCross);
export default MemoSvgUserCross;
