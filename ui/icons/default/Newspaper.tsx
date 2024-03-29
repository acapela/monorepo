import * as React from "react";

function SvgNewspaper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.624 2.351a.75.75 0 01.748-.002L6.5 4.136 9.628 2.35a.75.75 0 01.744 0L13.5 4.136l3.128-1.787A.75.75 0 0117.75 3v8.25H21a.75.75 0 01.75.75v7A2.75 2.75 0 0119 21.75H8.945c-1.367 0-2.47 0-3.337-.116-.9-.122-1.658-.38-2.26-.982-.602-.602-.86-1.36-.981-2.26-.117-.867-.117-1.97-.117-3.337V3a.75.75 0 01.374-.649zM19 20.25c.69 0 1.25-.56 1.25-1.25v-6.25h-2.5V19c0 .69.56 1.25 1.25 1.25zm-2.45 0H9c-1.435 0-2.437-.002-3.192-.103-.734-.099-1.122-.28-1.399-.556-.277-.277-.457-.665-.556-1.4-.101-.755-.103-1.756-.103-3.191V4.292l2.378 1.36a.75.75 0 00.744 0L10 3.863l3.128 1.787a.75.75 0 00.744 0l2.378-1.359V19c0 .45.108.875.3 1.25zM6.25 9A.75.75 0 017 8.25h4a.75.75 0 010 1.5H7A.75.75 0 016.25 9zM7 12.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H7zM6.25 17a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H7a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgNewspaper = React.memo(SvgNewspaper);
export default MemoSvgNewspaper;
