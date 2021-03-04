import * as React from "react";

function SvgPricetagsOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="pricetags">
          <path d="M12.87 22a1.84 1.84 0 01-1.29-.53l-6.41-6.42a1 1 0 01-.29-.61L4 5.09a1 1 0 01.29-.8 1 1 0 01.8-.29l9.35.88a1 1 0 01.61.29l6.42 6.41a1.82 1.82 0 010 2.57l-7.32 7.32a1.82 1.82 0 01-1.28.53zm-6-8.11l6 6 7.05-7.05-6-6-7.81-.73z" />
          <circle cx={10.5} cy={10.5} r={1.5} />
        </g>
      </g>
    </svg>
  );
}

export default SvgPricetagsOutline;
