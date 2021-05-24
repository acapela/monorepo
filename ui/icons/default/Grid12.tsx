import * as React from "react";

function SvgGrid12(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2.25h-.052c-.898 0-1.648 0-2.242.08-.628.084-1.195.27-1.65.725-.456.456-.642 1.023-.726 1.65-.08.595-.08 1.345-.08 2.243v10.104c0 .899 0 1.648.08 2.242.084.628.27 1.195.725 1.65.456.456 1.023.642 1.65.726.595.08 1.345.08 2.243.08h10.104c.899 0 1.648 0 2.242-.08.628-.084 1.195-.27 1.65-.726.456-.455.642-1.022.726-1.65.08-.594.08-1.343.08-2.242V6.948c0-.898 0-1.648-.08-2.242-.084-.628-.27-1.195-.726-1.65-.455-.456-1.022-.642-1.65-.726-.594-.08-1.343-.08-2.242-.08H7zm7.25 9h-4.5V4a.749.749 0 00-.043-.25h4.586a.747.747 0 00-.043.25v7.25zm0 1.5h-4.5V20a.749.749 0 01-.043.25h4.586a.747.747 0 01-.043-.25v-7.25zm1.457 7.5a.747.747 0 00.043-.25v-7.25h4.5V17c0 .964-.002 1.612-.067 2.095-.062.461-.169.659-.3.789-.13.13-.327.237-.788.3-.483.064-1.131.066-2.095.066h-1.293zm.043-9V4a.747.747 0 00-.043-.25H17c.964 0 1.612.002 2.095.067.461.062.659.169.789.3.13.13.237.327.3.788.064.483.066 1.131.066 2.095v4.25h-4.5zM8.25 4v16c0 .088.015.172.043.25H7c-.964 0-1.612-.002-2.095-.067-.461-.062-.659-.169-.789-.3-.13-.13-.237-.327-.3-.788-.064-.483-.066-1.131-.066-2.095V7c0-.964.002-1.612.067-2.095.062-.461.169-.659.3-.789.13-.13.327-.237.788-.3C5.388 3.753 6.036 3.75 7 3.75h1.293A.749.749 0 008.25 4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgGrid12 = React.memo(SvgGrid12);
export default MemoSvgGrid12;
