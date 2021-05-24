import * as React from "react";

function SvgHardDrive(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.685 1.25h-.047c-1.085 0-1.966 0-2.675.085-.74.088-1.374.276-1.928.71-.555.432-.891 1.002-1.156 1.698-.255.667-.468 1.522-.731 2.574l-.012.046-1.386 5.544-.013.052c-.226.905-.356 1.424-.421 1.957-.066.533-.066 1.067-.066 2V18.052c0 .899 0 1.648.08 2.242.084.628.27 1.195.725 1.65.456.456 1.023.642 1.65.726.595.08 1.345.08 2.243.08h10.104c.899 0 1.648 0 2.242-.08.628-.084 1.195-.27 1.65-.726.456-.455.642-1.022.726-1.65.08-.594.08-1.343.08-2.242V15.916c0-.933 0-1.467-.066-2-.065-.533-.195-1.052-.421-1.957l-.013-.052-1.386-5.544-.012-.046c-.263-1.052-.476-1.907-.73-2.574-.265-.696-.602-1.266-1.157-1.699-.554-.433-1.189-.62-1.928-.71-.709-.084-1.59-.084-2.675-.084h-2.677zM6.958 3.227c.259-.203.594-.332 1.183-.403.61-.073 1.4-.074 2.544-.074h2.63c1.144 0 1.935.001 2.544.074.59.07.924.2 1.183.403.26.202.466.495.678 1.05.218.573.411 1.34.689 2.45l1.386 5.544c.102.41.18.722.24.979H3.965c.06-.257.138-.57.24-.979l1.386-5.544c.278-1.11.47-1.877.69-2.45.21-.555.417-.848.677-1.05zM3.759 14.75c-.009.3-.009.678-.009 1.22V18c0 .964.002 1.612.067 2.095.062.461.169.659.3.789.13.13.327.237.788.3.483.064 1.131.066 2.095.066h10c.964 0 1.612-.002 2.095-.067.461-.062.659-.169.789-.3.13-.13.237-.327.3-.788.064-.483.066-1.131.066-2.095v-2.03c0-.542 0-.92-.01-1.22H3.76zM8 18a1 1 0 11-2 0 1 1 0 012 0zm3-.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgHardDrive = React.memo(SvgHardDrive);
export default MemoSvgHardDrive;
