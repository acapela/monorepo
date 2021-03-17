import * as React from "react";

function SvgShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M20.12 6.71l-2.83-2.83A3 3 0 0015.17 3H8.83a3 3 0 00-2.12.88L3.88 6.71A3 3 0 003 8.83V18a3 3 0 003 3h12a3 3 0 003-3V8.83a3 3 0 00-.88-2.12zM12 16a4 4 0 01-4-4 1 1 0 012 0 2 2 0 004 0 1 1 0 012 0 4 4 0 01-4 4zM6.41 7l1.71-1.71A1.05 1.05 0 018.83 5h6.34a1.05 1.05 0 01.71.29L17.59 7z"
          data-name="shopping-bag"
        />
      </g>
    </svg>
  );
}

export default SvgShoppingBag;
