import * as React from "react";

function SvgPlayNext(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.525 5.449l-.05-.033c-.641-.428-1.193-.796-1.651-1.012-.471-.223-1.063-.393-1.65-.078-.587.314-.774.9-.85 1.415-.074.502-.074 1.165-.074 1.936v8.646c0 .771 0 1.434.074 1.936.076.515.263 1.101.85 1.415.587.314 1.179.145 1.65-.078.458-.216 1.01-.584 1.652-1.012l.05-.033 6.394-4.263.046-.03c.525-.35.987-.658 1.31-.951.345-.311.671-.726.671-1.307s-.326-.996-.67-1.307c-.324-.293-.786-.6-1.311-.95l-.046-.031-6.395-4.263zm-2.67.207s.004-.002.014-.002l-.013.002zm.328.104a1.048 1.048 0 00-.297-.105c-.02.037-.051.124-.078.306-.056.378-.058.928-.058 1.776v8.526c0 .848.002 1.398.058 1.776.027.182.059.269.078.306a1.05 1.05 0 00.297-.105c.346-.163.805-.467 1.51-.937l6.395-4.263c.585-.39.952-.637 1.183-.846a.883.883 0 00.17-.189l.004-.005-.003-.005a.883.883 0 00-.171-.19c-.231-.208-.598-.455-1.183-.845L7.693 6.697c-.705-.47-1.164-.774-1.51-.937zm-.327 12.584l.013.002c-.01 0-.014-.001-.013-.002zm.038.016c.007.005.01.009.01.01-.001 0-.004-.002-.01-.01zm0-12.72c.006-.008.009-.01.01-.01 0 .001-.003.005-.01.01zM20.75 5a.75.75 0 00-1.5 0v14a.75.75 0 001.5 0V5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPlayNext = React.memo(SvgPlayNext);
export default MemoSvgPlayNext;
