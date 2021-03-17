import * as React from "react";

function SvgColorPalette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.54 5.08A10.61 10.61 0 0011.91 2a10 10 0 00-.05 20 2.58 2.58 0 002.53-1.89 2.52 2.52 0 00-.57-2.28.5.5 0 01.37-.83h1.65A6.15 6.15 0 0022 11.33a8.48 8.48 0 00-2.46-6.25zm-12.7 9.66a1.5 1.5 0 11.4-2.08 1.49 1.49 0 01-.4 2.08zM8.3 9.25a1.5 1.5 0 11-.55-2 1.5 1.5 0 01.55 2zM11 7a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0111 7zm5.75.8a1.5 1.5 0 11.55-2 1.5 1.5 0 01-.55 2z"
          data-name="color-palette"
        />
      </g>
    </svg>
  );
}

export default SvgColorPalette;
