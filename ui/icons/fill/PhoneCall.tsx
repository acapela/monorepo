import * as React from "react";

function SvgPhoneCall(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="phone-call">
          <path d="M13 8a3 3 0 013 3 1 1 0 002 0 5 5 0 00-5-5 1 1 0 000 2z" />
          <path d="M13 4a7 7 0 017 7 1 1 0 002 0 9 9 0 00-9-9 1 1 0 000 2zM21.75 15.91a1 1 0 00-.72-.65l-6-1.37a1 1 0 00-.92.26c-.14.13-.15.14-.8 1.38a9.91 9.91 0 01-4.87-4.89C9.71 10 9.72 10 9.85 9.85a1 1 0 00.26-.92L8.74 3a1 1 0 00-.65-.72 3.79 3.79 0 00-.72-.18A3.94 3.94 0 006.6 2 4.6 4.6 0 002 6.6 15.42 15.42 0 0017.4 22a4.6 4.6 0 004.6-4.6 4.77 4.77 0 00-.06-.76 4.34 4.34 0 00-.19-.73z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgPhoneCall;
