import * as React from "react";

function SvgArchive(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M18 3H6a3 3 0 00-2 5.22V18a3 3 0 003 3h10a3 3 0 003-3V8.22A3 3 0 0018 3zm-3 10.13a.87.87 0 01-.87.87H9.87a.87.87 0 01-.87-.87v-.26a.87.87 0 01.87-.87h4.26a.87.87 0 01.87.87zM18 7H6a1 1 0 010-2h12a1 1 0 010 2z"
          data-name="archive"
        />
      </g>
    </svg>
  );
}

export default SvgArchive;
