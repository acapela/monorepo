import * as React from "react";

function SvgShoppingBagOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="shopping-bag">
          <path d="M20.12 6.71l-2.83-2.83A3 3 0 0015.17 3H8.83a3 3 0 00-2.12.88L3.88 6.71A3 3 0 003 8.83V18a3 3 0 003 3h12a3 3 0 003-3V8.83a3 3 0 00-.88-2.12zm-12-1.42A1.05 1.05 0 018.83 5h6.34a1.05 1.05 0 01.71.29L17.59 7H6.41zM18 19H6a1 1 0 01-1-1V9h14v9a1 1 0 01-1 1z" />
          <path d="M15 11a1 1 0 00-1 1 2 2 0 01-4 0 1 1 0 00-2 0 4 4 0 008 0 1 1 0 00-1-1z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgShoppingBagOutline;
