import * as React from "react";

function SvgBriefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="briefcase">
          <path d="M7 21h10V7h-1V5.5A2.5 2.5 0 0013.5 3h-3A2.5 2.5 0 008 5.5V7H7zm3-15.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V7h-4zM19 7v14a3 3 0 003-3v-8a3 3 0 00-3-3zM5 7a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgBriefcase;
