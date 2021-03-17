import * as React from "react";

function SvgAlertTriangleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="alert-triangle">
          <path d="M22.56 16.3L14.89 3.58a3.43 3.43 0 00-5.78 0L1.44 16.3a3 3 0 00-.05 3A3.37 3.37 0 004.33 21h15.34a3.37 3.37 0 002.94-1.66 3 3 0 00-.05-3.04zm-1.7 2.05a1.31 1.31 0 01-1.19.65H4.33a1.31 1.31 0 01-1.19-.65 1 1 0 010-1l7.68-12.73a1.48 1.48 0 012.36 0l7.67 12.72a1 1 0 01.01 1.01z" />
          <circle cx={12} cy={16} r={1} />
          <path d="M12 8a1 1 0 00-1 1v4a1 1 0 002 0V9a1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgAlertTriangleOutline;
