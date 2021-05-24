import * as React from "react";

function SvgCopyright(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM3.75 12a8.25 8.25 0 1116.5 0 8.25 8.25 0 01-16.5 0zm8.139-4.75C9.307 7.25 7.25 9.397 7.25 12s2.057 4.75 4.639 4.75a4.552 4.552 0 002.792-.956c.35-.271.662-.592.925-.951a.75.75 0 10-1.212-.885 3.22 3.22 0 01-.63.649 3.052 3.052 0 01-1.875.643c-1.714 0-3.139-1.435-3.139-3.25s1.425-3.25 3.139-3.25c.702 0 1.35.238 1.875.643.238.184.45.403.63.649a.75.75 0 101.212-.885 4.718 4.718 0 00-.925-.95 4.552 4.552 0 00-2.792-.957z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCopyright = React.memo(SvgCopyright);
export default MemoSvgCopyright;
