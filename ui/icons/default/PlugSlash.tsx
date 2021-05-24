import * as React from "react";

function SvgPlugSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.75 2v2a.75.75 0 01-1.5 0V2a.75.75 0 011.5 0zm-8.28-.53a.75.75 0 011.06 0l5 5 11 11 4 4a.75.75 0 11-1.06 1.06L18 19.06l-.348.349-.09.09c-.85.85-1.398 1.398-2.08 1.742-.21.106-.428.197-.652.27-.726.24-1.502.24-2.704.239h-.253c-1.201 0-1.977 0-2.703-.239a4.753 4.753 0 01-.652-.27c-.682-.344-1.23-.892-2.08-1.742l-.09-.09-.614-.614-.103-.103c-.979-.979-1.611-1.61-1.97-2.416a4.741 4.741 0 01-.096-.232c-.316-.823-.315-1.717-.315-3.1V10a3.75 3.75 0 012.251-3.438L1.47 2.53a.75.75 0 010-1.06zm5.238 6.299A2.25 2.25 0 004.75 10v2.798c0 1.58.012 2.177.216 2.709.02.053.042.107.065.159.232.52.646.95 1.764 2.068l.614.614c.97.97 1.344 1.332 1.785 1.554.143.072.293.134.446.185.468.154.988.163 2.36.163 1.372 0 1.892-.009 2.36-.163.154-.05.303-.113.447-.185.44-.222.814-.583 1.784-1.554l.348-.348L6.71 7.769zm10.484.084c-.756-.101-1.757-.103-3.192-.103h-3a.75.75 0 010-1.5h3.25V2a.75.75 0 011.5 0v4.26a14.96 14.96 0 011.642.107c.9.12 1.658.38 2.26.981.602.602.86 1.36.982 2.26.116.867.116 1.97.116 3.337V15a.75.75 0 01-1.5 0v-2c0-1.435-.002-2.437-.103-3.192-.099-.734-.28-1.122-.556-1.399-.277-.277-.665-.457-1.4-.556z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPlugSlash = React.memo(SvgPlugSlash);
export default MemoSvgPlugSlash;
