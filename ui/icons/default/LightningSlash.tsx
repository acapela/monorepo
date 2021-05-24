import * as React from "react";

function SvgLightningSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.217 1.282A.75.75 0 0114.75 2v7.25H19a.75.75 0 01.624 1.166l-2 3a.75.75 0 11-1.248-.832l1.223-1.834H14a.75.75 0 01-.75-.75V4.477l-1.96 2.94a.75.75 0 01-1.247-.833l3.333-5a.75.75 0 01.841-.302zM2.47 2.47a.75.75 0 011.06 0l6.2 6.2 6.2 6.2 5.6 5.6a.75.75 0 01-1.06 1.06l-4.953-4.953-3.893 5.84A.75.75 0 0110.25 22v-7.25H6a.75.75 0 01-.624-1.166l2.859-4.288L2.47 3.53a.75.75 0 010-1.06zm6.847 7.907L7.4 13.25H11a.75.75 0 01.75.75v5.523l2.685-4.027-5.118-5.119z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLightningSlash = React.memo(SvgLightningSlash);
export default MemoSvgLightningSlash;
