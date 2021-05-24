import * as React from "react";

function SvgAward(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.25a7.75 7.75 0 00-4.773 13.856l-.97 6.788a.75.75 0 001.022.802L12 20.808l4.721 1.888a.75.75 0 001.021-.802l-.97-6.788A7.75 7.75 0 0012 1.25zm3.382 14.725A7.718 7.718 0 0112 16.75a7.718 7.718 0 01-3.382-.775l-.692 4.847 3.796-1.518a.75.75 0 01.556 0l3.796 1.518-.692-4.847zM5.75 9a6.25 6.25 0 1112.5 0 6.25 6.25 0 01-12.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgAward = React.memo(SvgAward);
export default MemoSvgAward;
