import * as React from "react";

function SvgLoader(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21.75a.75.75 0 01-.75-.75v-3.343a.75.75 0 111.5 0V21a.75.75 0 01-.75.75zm0-14.657a.75.75 0 01-.75-.75V3a.75.75 0 011.5 0v3.343a.75.75 0 01-.75.75zm-6.894 10.74a.75.75 0 001.06 1.061l2.365-2.364a.75.75 0 10-1.061-1.06l-2.364 2.364zM15.47 7.47a.75.75 0 001.06 1.06l2.364-2.364a.75.75 0 10-1.06-1.06L15.47 7.47zM3 11.25a.75.75 0 000 1.5h3.343a.75.75 0 000-1.5H3zm14.657 0a.75.75 0 000 1.5H21a.75.75 0 000-1.5h-3.343zm.177 7.644a.75.75 0 001.06-1.06L16.53 15.47a.75.75 0 10-1.06 1.06l2.364 2.364zM7.47 8.531A.75.75 0 008.53 7.47L6.167 5.106a.75.75 0 00-1.06 1.06L7.47 8.531z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgLoader = React.memo(SvgLoader);
export default MemoSvgLoader;
