import * as React from "react";

function SvgCrop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 2a.75.75 0 00-1.5 0v2.25H2a.75.75 0 000 1.5h2.25v9.302c0 .899 0 1.648.08 2.242.084.628.27 1.195.725 1.65.456.456 1.023.642 1.65.726.595.08 1.345.08 2.243.08h9.302V22a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5H9c-.964 0-1.612-.002-2.095-.067-.461-.062-.659-.169-.789-.3-.13-.13-.237-.327-.3-.788-.064-.483-.066-1.131-.066-2.095V2zM15 5.75c.964 0 1.612.002 2.095.067.461.062.659.169.789.3.13.13.237.327.3.788.064.483.066 1.131.066 2.095v7a.75.75 0 001.5 0V8.948c0-.898 0-1.648-.08-2.242-.084-.628-.27-1.195-.726-1.65-.455-.456-1.022-.642-1.65-.726-.594-.08-1.344-.08-2.242-.08H8a.75.75 0 000 1.5h7z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCrop = React.memo(SvgCrop);
export default MemoSvgCrop;
