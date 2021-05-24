import * as React from "react";

function SvgTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.406 2.25h3.188c.317 0 .615 0 .865.028.278.032.57.106.844.302.272.197.434.451.553.705.106.228.2.51.3.812l.011.033.374 1.12H21a.75.75 0 010 1.5h-1.298l-.58 8.699-.004.053c-.085 1.282-.154 2.318-.316 3.132-.169.845-.455 1.551-1.047 2.104-.591.554-1.315.793-2.17.904-.822.108-1.86.108-3.146.108H11.561c-1.286 0-2.324 0-3.146-.108-.855-.111-1.579-.35-2.17-.904-.592-.553-.878-1.26-1.047-2.104-.162-.814-.23-1.85-.316-3.132l-.004-.053-.58-8.699H3a.75.75 0 010-1.5h4.46l.373-1.12.01-.033c.101-.301.195-.584.301-.812a1.73 1.73 0 01.554-.705 1.73 1.73 0 01.843-.302 8.1 8.1 0 01.865-.028zm-1.365 3h5.918l-.215-.645a7.363 7.363 0 00-.248-.687.64.64 0 00-.07-.12l-.002-.001s-.004-.003-.012-.005a.64.64 0 00-.123-.023 7.371 7.371 0 00-.73-.019h-3.117c-.366 0-.576.001-.73.019a.64.64 0 00-.136.028h-.001l-.001.001-.009.01a.64.64 0 00-.06.11c-.066.14-.134.34-.25.687l-.214.645zM5.8 6.75l.574 8.6c.09 1.347.154 2.285.294 2.99.137.685.327 1.047.6 1.303.274.256.648.422 1.34.512.713.093 1.653.095 3.004.095h.774c1.35 0 2.29-.002 3.004-.095.692-.09 1.066-.256 1.34-.512.273-.256.463-.618.6-1.303.14-.705.204-1.643.294-2.99l.573-8.6H5.802zM10 9.25a.75.75 0 01.75.75v7a.75.75 0 01-1.5 0v-7a.75.75 0 01.75-.75zm4.75.75a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTrash = React.memo(SvgTrash);
export default MemoSvgTrash;
