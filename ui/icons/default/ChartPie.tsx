import * as React from "react";

function SvgChartPie(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25a.75.75 0 00-.75.75v9c0 .414.336.75.75.75h9a.75.75 0 00.75-.75c0-5.385-4.365-9.75-9.75-9.75zm.75 9V3.784a8.252 8.252 0 017.466 7.466H12.75zM9.282 4.208a.75.75 0 00-.495-1.416A9.75 9.75 0 002.25 12c0 5.385 4.365 9.75 9.75 9.75a9.754 9.754 0 009.195-6.5.75.75 0 10-1.414-.5A8.254 8.254 0 0112 20.25 8.25 8.25 0 019.282 4.208z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgChartPie = React.memo(SvgChartPie);
export default MemoSvgChartPie;
