import * as React from "react";

function SvgPlug(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.25a.75.75 0 01.75.75v4.25h4.5V2a.75.75 0 111.5 0v4.258a15.4 15.4 0 011.614.094c.841.106 1.556.332 2.144.86.098.088.192.182.28.28.529.588.754 1.303.86 2.144.102.812.102 1.838.102 3.111v.196c0 1.384 0 2.278-.315 3.101a4.74 4.74 0 01-.096.232c-.359.805-.991 1.438-1.97 2.416l-.103.103-.614.614-.09.09c-.85.85-1.398 1.398-2.08 1.742-.21.106-.428.197-.652.27-.726.24-1.502.24-2.704.239h-.252c-1.202 0-1.978 0-2.704-.239a4.753 4.753 0 01-.652-.27c-.682-.344-1.23-.892-2.08-1.742l-.09-.09-.614-.614-.103-.103c-.979-.979-1.611-1.61-1.97-2.416a4.741 4.741 0 01-.096-.232c-.316-.823-.315-1.717-.315-3.1V12.747c0-1.273 0-2.3.102-3.111.106-.841.332-1.556.86-2.144.088-.098.182-.192.28-.28.588-.528 1.303-.754 2.144-.86a15.399 15.399 0 011.614-.094V2A.75.75 0 019 1.25zM6.823 7.84c-.688.087-1.06.246-1.328.487-.059.053-.115.11-.168.168-.241.269-.4.64-.487 1.328-.089.707-.09 1.64-.09 2.975 0 1.58.012 2.177.216 2.709.02.053.042.107.065.159.232.52.646.95 1.764 2.068l.614.614c.97.97 1.344 1.332 1.785 1.554.143.072.293.134.446.185.469.154.988.163 2.36.163 1.372 0 1.892-.009 2.36-.163.154-.05.303-.113.447-.185.44-.222.814-.583 1.784-1.554l.614-.614c1.118-1.118 1.532-1.548 1.764-2.068l.066-.159c.203-.532.215-1.128.215-2.71 0-1.335-.001-2.267-.09-2.974-.087-.689-.246-1.06-.487-1.328a2.257 2.257 0 00-.168-.168c-.268-.241-.64-.4-1.328-.487-.707-.089-1.639-.09-2.975-.09H9.798c-1.336 0-2.267.001-2.975.09z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPlug = React.memo(SvgPlug);
export default MemoSvgPlug;
