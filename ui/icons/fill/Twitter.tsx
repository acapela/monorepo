import * as React from "react";

function SvgTwitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M8.08 20A11.07 11.07 0 0019.52 9 8.09 8.09 0 0021 6.16a.44.44 0 00-.62-.51 1.88 1.88 0 01-2.16-.38 3.89 3.89 0 00-5.58-.17A4.13 4.13 0 0011.49 9C8.14 9.2 5.84 7.61 4 5.43a.43.43 0 00-.75.24 9.68 9.68 0 004.6 10.05A6.73 6.73 0 013.38 18a.45.45 0 00-.14.84A11 11 0 008.08 20"
          data-name="twitter"
        />
      </g>
    </svg>
  );
}

export default SvgTwitter;
