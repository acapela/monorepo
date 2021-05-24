import * as React from "react";

function SvgBookmarkSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.47 1.47a.75.75 0 011.06 0l2.113 2.112A2.749 2.749 0 017 2.25h6.055c1.367 0 2.47 0 3.337.117.9.12 1.658.38 2.26.981.602.602.86 1.36.982 2.26.116.867.116 1.97.116 3.337v9.745l2.78 2.78a.75.75 0 11-1.06 1.06l-3-3-14-14-3-3a.75.75 0 010-1.06zm16.78 15.72V9c0-1.435-.002-2.437-.103-3.192-.099-.734-.28-1.122-.556-1.399-.277-.277-.665-.457-1.4-.556-.754-.101-1.756-.103-3.191-.103H7a1.25 1.25 0 00-1.219.97L18.25 17.19zm-12.5 2.518V9a.75.75 0 00-1.5 0v12a.75.75 0 001.122.651l7-4a.75.75 0 00-.744-1.302L5.75 19.708z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBookmarkSlash = React.memo(SvgBookmarkSlash);
export default MemoSvgBookmarkSlash;
