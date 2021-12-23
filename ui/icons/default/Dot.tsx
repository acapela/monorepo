import * as React from "react";

export default React.memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width=".8em" height=".8em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="6" cy="6" r="6" fill="currentColor" />
  </svg>
));
