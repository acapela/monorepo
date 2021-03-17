import * as React from "react";

function SvgTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M21 6h-5V4.33A2.42 2.42 0 0013.5 2h-3A2.42 2.42 0 008 4.33V6H3a1 1 0 000 2h1v11a3 3 0 003 3h10a3 3 0 003-3V8h1a1 1 0 000-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4z"
          data-name="trash"
        />
      </g>
    </svg>
  );
}

export default SvgTrash;
