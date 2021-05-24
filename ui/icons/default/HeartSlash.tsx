import * as React from "react";

function SvgHeartSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.47 1.47a.75.75 0 011.06 0l3.51 3.51L16.73 15.668l4.801 4.802a.75.75 0 11-1.06 1.06l-4.272-4.271-3.002 2.998a1.697 1.697 0 01-2.392 0l-7.007-6.998a5.223 5.223 0 010-7.421 5.42 5.42 0 01.522-.458l-2.85-2.85a.75.75 0 010-1.06zm3.922 4.983a3.91 3.91 0 00-.535.446 3.723 3.723 0 000 5.299l7.007 6.998c.072.072.2.072.272 0l3.001-2.998-9.745-9.745zm13.75.446c-1.534-1.532-4.065-1.532-5.6 0L12.53 7.91a.75.75 0 01-1.06 0L10.457 6.9a3.9 3.9 0 00-1.668-.988.75.75 0 11.422-1.44 5.435 5.435 0 012.306 1.366L12 6.32l.482-.482c2.12-2.117 5.6-2.117 7.72 0a5.223 5.223 0 010 7.42l-1.273 1.273a.75.75 0 01-1.06-1.062l1.274-1.271a3.723 3.723 0 000-5.299z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgHeartSlash = React.memo(SvgHeartSlash);
export default MemoSvgHeartSlash;
