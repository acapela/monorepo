import * as React from "react";

function SvgCodeDownload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <g data-name="Layer 2">
        <g data-name="code-download">
          <path d="M4.29 12l4.48-5.36a1 1 0 10-1.54-1.28l-5 6a1 1 0 000 1.27l4.83 6a1 1 0 00.78.37 1 1 0 00.78-1.63zM21.78 11.37l-4.78-6a1 1 0 00-1.56 1.26L19.71 12l-4.48 5.37a1 1 0 00.13 1.41A1 1 0 0016 19a1 1 0 00.77-.36l5-6a1 1 0 00.01-1.27z" />
          <path d="M15.72 11.41a1 1 0 00-1.41 0L13 12.64V8a1 1 0 00-2 0v4.59l-1.29-1.3a1 1 0 00-1.42 1.42l3 3A1 1 0 0012 16a1 1 0 00.69-.28l3-2.9a1 1 0 00.03-1.41z" />
        </g>
      </g>
    </svg>
  );
}

export default SvgCodeDownload;
