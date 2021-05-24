import * as React from "react";

function SvgPower(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.75 2a.75.75 0 00-1.5 0v10a.75.75 0 001.5 0V2zM6.814 5.583a.75.75 0 10-.943-1.166c-.408.33-.789.692-1.138 1.083A9.717 9.717 0 002.25 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75c0-2.497-.94-4.776-2.483-6.5-.35-.39-.73-.753-1.138-1.083a.75.75 0 00-.944 1.166A8.216 8.216 0 0120.25 12 8.25 8.25 0 116.815 5.583z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPower = React.memo(SvgPower);
export default MemoSvgPower;
