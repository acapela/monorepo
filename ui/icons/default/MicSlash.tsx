import * as React from "react";

function SvgMicSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.25A3.75 3.75 0 008.25 5v.5a.75.75 0 001.5 0V5a2.25 2.25 0 014.5 0v6a.75.75 0 001.5 0V5A3.75 3.75 0 0012 1.25zM3.53 2.47a.75.75 0 00-1.06 1.06l5.78 5.78V12A3.75 3.75 0 0012 15.75h2.69l1.226 1.227c-1.187.875-2.652 1.273-3.916 1.273-1.35 0-2.926-.454-4.15-1.456-1.2-.982-2.1-2.519-2.1-4.794a.75.75 0 00-1.5 0c0 2.725 1.1 4.688 2.65 5.956 1.3 1.063 2.888 1.617 4.35 1.758V22a.75.75 0 001.5 0v-2.287c1.41-.136 2.938-.656 4.21-1.646a.709.709 0 00.026-.02l3.484 3.483a.75.75 0 101.06-1.06l-6-6-6-6-6-6zM9.75 12v-1.19l3.44 3.44H12A2.25 2.25 0 019.75 12zm10 0a.75.75 0 00-1.5 0c0 .67-.078 1.274-.216 1.814a.75.75 0 101.453.372c.171-.67.263-1.398.263-2.186z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMicSlash = React.memo(SvgMicSlash);
export default MemoSvgMicSlash;
