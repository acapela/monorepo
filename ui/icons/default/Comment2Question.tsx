import * as React from "react";

function SvgComment2Question(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.75A8.25 8.25 0 003.75 12c0 .846.179 1.712.436 2.517l.006.018c.303.95.538 1.685.693 2.25.151.55.254 1.032.233 1.438-.014.276-.03.387-.092.656-.087.375-.26.731-.484 1.115-.048.082-.1.167-.155.256H12a8.25 8.25 0 100-16.5zM2.382 20.576A.75.75 0 003 21.75h9c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12c0 1.047.22 2.073.507 2.973.31.972.536 1.677.682 2.209.15.55.188.824.181.964-.006.113-.01.16-.015.199-.006.04-.015.085-.04.195-.037.157-.121.36-.317.695-.197.335-.474.752-.866 1.34zM13 16a1 1 0 11-2 0 1 1 0 012 0zm-2.25-6a1.25 1.25 0 112.5 0v.121c0 .364-.145.713-.402.97L11.47 12.47a.75.75 0 101.06 1.06l1.379-1.378a2.871 2.871 0 00.841-2.03V10a2.75 2.75 0 10-5.5 0v.5a.75.75 0 001.5 0V10z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgComment2Question = React.memo(SvgComment2Question);
export default MemoSvgComment2Question;
