import * as React from "react";

function SvgQuestion(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM13 16a1 1 0 11-2 0 1 1 0 012 0zm-2.25-6a1.25 1.25 0 112.5 0v.121c0 .364-.145.713-.402.97L11.47 12.47a.75.75 0 101.06 1.06l1.379-1.378a2.871 2.871 0 00.841-2.03V10a2.75 2.75 0 10-5.5 0v.5a.75.75 0 001.5 0V10z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgQuestion = React.memo(SvgQuestion);
export default MemoSvgQuestion;
