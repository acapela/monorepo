import * as React from "react";

function SvgGoogleOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M12 22h-.43A10.16 10.16 0 012 12.29a10 10 0 0114.12-9.41 1.48 1.48 0 01.77.86 1.47 1.47 0 01-.1 1.16L15.5 7.28a1.44 1.44 0 01-1.83.64A4.5 4.5 0 008.77 9a4.41 4.41 0 00-1.16 3.34 4.36 4.36 0 001.66 3 4.52 4.52 0 003.45 1 3.89 3.89 0 002.63-1.57h-2.9A1.45 1.45 0 0111 13.33v-2.68a1.45 1.45 0 011.45-1.45h8.1A1.46 1.46 0 0122 10.64v1.88A10 10 0 0112 22zm0-18a8 8 0 00-8 8.24A8.12 8.12 0 0011.65 20 8 8 0 0020 12.42V11.2h-7v1.58h5.31l-.41 1.3a6 6 0 01-4.9 4.25A6.58 6.58 0 018 17a6.33 6.33 0 01-.72-9.3A6.52 6.52 0 0114 5.91l.77-1.43A7.9 7.9 0 0012 4z"
          data-name="google"
        />
      </g>
    </svg>
  );
}

export default SvgGoogleOutline;
