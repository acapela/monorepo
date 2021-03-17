import * as React from "react";

function SvgAttach2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 22a5.86 5.86 0 01-6-5.7V6.13A4.24 4.24 0 0110.33 2a4.24 4.24 0 014.34 4.13v10.18a2.67 2.67 0 01-5.33 0V6.92a1 1 0 011-1 1 1 0 011 1v9.39a.67.67 0 001.33 0V6.13A2.25 2.25 0 0010.33 4 2.25 2.25 0 008 6.13V16.3a3.86 3.86 0 004 3.7 3.86 3.86 0 004-3.7V6.13a1 1 0 112 0V16.3a5.86 5.86 0 01-6 5.7z"
          data-name="attach-2"
        />
      </g>
    </svg>
  );
}

export default SvgAttach2;
