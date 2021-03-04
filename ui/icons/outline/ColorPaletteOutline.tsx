import * as React from "react";

function SvgColorPaletteOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="color-palette">
          <path d="M19.54 5.08A10.61 10.61 0 0011.91 2a10 10 0 00-.05 20 2.58 2.58 0 002.53-1.89 2.52 2.52 0 00-.57-2.28.5.5 0 01.37-.83h1.65A6.15 6.15 0 0022 11.33a8.48 8.48 0 00-2.46-6.25zM15.88 15h-1.65a2.49 2.49 0 00-1.87 4.15.49.49 0 01.12.49c-.05.21-.28.34-.59.36a8 8 0 01-7.82-9.11A8.1 8.1 0 0111.92 4H12a8.47 8.47 0 016.1 2.48 6.5 6.5 0 011.9 4.77A4.17 4.17 0 0115.88 15z" />
          <circle cx={12} cy={6.5} r={1.5} />
          <path d="M15.25 7.2a1.5 1.5 0 102.05.55 1.5 1.5 0 00-2.05-.55zM8.75 7.2a1.5 1.5 0 10.55 2.05 1.5 1.5 0 00-.55-2.05zM6.16 11.26a1.5 1.5 0 102.08.4 1.49 1.49 0 00-2.08-.4z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgColorPaletteOutline;
