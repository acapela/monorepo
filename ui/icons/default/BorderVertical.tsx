import * as React from "react";

function SvgBorderVertical(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.75 3a.75.75 0 00-1.5 0v18a.75.75 0 001.5 0V3zM20 5a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zM5 20a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm9-1a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zM5 16a1 1 0 11-2 0 1 1 0 012 0zm12-4a1 1 0 11-2 0 1 1 0 012 0zm-9 1a1 1 0 100-2 1 1 0 000 2zm-3-1a1 1 0 11-2 0 1 1 0 012 0zm0-4a1 1 0 11-2 0 1 1 0 012 0zm12-4a1 1 0 11-2 0 1 1 0 012 0zM8 5a1 1 0 100-2 1 1 0 000 2zM5 4a1 1 0 11-2 0 1 1 0 012 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBorderVertical = React.memo(SvgBorderVertical);
export default MemoSvgBorderVertical;
