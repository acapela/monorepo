import * as React from "react";

export default React.memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" {...props}>
    <path
      d="M 12.053 6.1 C 9.211 5.2 9.842 1.9 7 1.9 C 4.158 1.9 4.789 5.2 1.947 6.1"
      fill="transparent"
      strokeWidth="2"
      stroke="hsl(0, 0%, 100%)"
      strokeLinecap="round"
    />
  </svg>
));
