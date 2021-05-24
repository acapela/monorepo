import * as React from "react";

function SvgPlanet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4.75A7.25 7.25 0 007.38 17.586c1.867-.556 4.034-1.494 6.247-2.771 2.212-1.278 4.108-2.686 5.524-4.025a7.247 7.247 0 00-2.815-4.602A7.215 7.215 0 0012 4.75zm7.212 7.996c-1.362 1.155-3.005 2.31-4.836 3.367-1.832 1.058-3.655 1.904-5.338 2.506a7.25 7.25 0 0010.174-5.873zM7.07 19.229a8.75 8.75 0 0013.657-7.884c.211-.215.41-.43.598-.64.79-.891 1.396-1.778 1.727-2.607.327-.82.432-1.71-.009-2.473-.512-.887-1.536-1.224-2.591-1.29-.998-.064-2.204.097-3.52.436a8.75 8.75 0 00-13.657 7.885c-.951.97-1.694 1.933-2.137 2.83-.47.947-.69 2.002-.178 2.889.44.762 1.264 1.118 2.137 1.244.883.128 1.954.047 3.12-.192.277-.057.562-.123.853-.198zm-1.428-1.218a8.742 8.742 0 01-2.027-3.507c-.509.598-.89 1.154-1.133 1.647-.394.795-.354 1.247-.223 1.474.112.194.395.414 1.053.51.59.085 1.378.05 2.33-.125zM18.36 5.989c.774-.142 1.447-.193 1.997-.158.884.056 1.256.317 1.387.544.112.194.161.55-.085 1.167-.221.554-.645 1.218-1.271 1.954a8.743 8.743 0 00-2.028-3.507z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPlanet = React.memo(SvgPlanet);
export default MemoSvgPlanet;
