import * as React from "react";

function SvgMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="menu">
          <rect x={3} y={11} width={18} height={2} rx={0.95} ry={0.95} />
          <rect x={3} y={16} width={18} height={2} rx={0.95} ry={0.95} />
          <rect x={3} y={6} width={18} height={2} rx={0.95} ry={0.95} />
        </g>
      </g>
    </svg>
  );
}

export default SvgMenu;
