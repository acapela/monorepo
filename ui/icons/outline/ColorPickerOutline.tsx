import * as React from "react";

function SvgColorPickerOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <path
          d="M19.4 7.34L16.66 4.6A1.92 1.92 0 0014 4.53l-2 2-1.29-1.24a1 1 0 00-1.42 1.42L10.53 8 5 13.53a2 2 0 00-.57 1.21L4 18.91a1 1 0 00.29.8A1 1 0 005 20h.09l4.17-.38a2 2 0 001.21-.57l5.58-5.58 1.24 1.24a1 1 0 001.42 0 1 1 0 000-1.42l-1.24-1.24 2-2a1.92 1.92 0 00-.07-2.71zM9.08 17.62l-3 .28.27-3L12 9.36l2.69 2.7zm7-7L13.36 8l1.91-2L18 8.73z"
          data-name="color-picker"
        />
      </g>
    </svg>
  );
}

export default SvgColorPickerOutline;
