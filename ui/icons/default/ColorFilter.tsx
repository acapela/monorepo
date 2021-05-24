import * as React from "react";

function SvgColorFilter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75 8a4.25 4.25 0 118.5 0 4.25 4.25 0 01-8.5 0zM12 2.25a5.75 5.75 0 00-5.562 7.215A5.752 5.752 0 008 20.75a5.731 5.731 0 004-1.62 5.75 5.75 0 105.562-9.666A5.75 5.75 0 0012 2.25zm4.987 8.615a5.763 5.763 0 01-3.425 2.67 5.757 5.757 0 01-.624 4.413 4.25 4.25 0 104.048-7.083zm-4.924 2.885H12a5.748 5.748 0 01-4.987-2.885 4.25 4.25 0 105.05 2.885z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgColorFilter = React.memo(SvgColorFilter);
export default MemoSvgColorFilter;
