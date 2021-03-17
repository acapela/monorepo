import * as React from "react";

function SvgSmilingFace(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <defs>
        <style />
      </defs>
      <g id="smiling-face_svg__Layer_2" data-name="Layer 2">
        <g id="smiling-face_svg__smiling-face">
          <g id="smiling-face_svg__smiling-face" data-name="smiling-face">
            <path
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm5 9a5 5 0 01-10 0z"
              id="smiling-face_svg__\uD83C\uDFA8-Icon-\u0421olor"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default SvgSmilingFace;
