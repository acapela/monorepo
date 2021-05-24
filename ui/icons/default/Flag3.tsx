import * as React from "react";

function SvgFlag3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 1.25a.75.75 0 01.75.75v1.471l9.088 3.246.059.021c.893.32 1.641.586 2.165.862.513.27 1.096.694 1.142 1.448.045.755-.482 1.245-.96 1.575-.486.337-1.197.692-2.046 1.116l-.055.028-9.393 4.697V22a.75.75 0 01-1.5 0V2A.75.75 0 016 1.25zm.75 13.537l8.723-4.362c.918-.459 1.53-.767 1.918-1.036.179-.123.26-.204.296-.25a1.42 1.42 0 00-.323-.212c-.418-.22-1.063-.452-2.03-.797L6.75 5.064v9.723zm10.968-5.608s-.004-.004-.006-.012l.006.012zm-.01-.07c.002-.008.004-.012.005-.012 0 0 0 .004-.005.012z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFlag3 = React.memo(SvgFlag3);
export default MemoSvgFlag3;
