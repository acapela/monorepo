import * as React from "react";

function SvgMaximize3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.473 3.25H9a.75.75 0 010 1.5h-.5c-.71 0-1.203 0-1.59.027-.38.026-.602.074-.771.144A2.25 2.25 0 004.921 6.14c-.07.169-.118.39-.144.77-.027.388-.027.882-.027 1.591V9a.75.75 0 01-1.5 0v-.527c0-.676 0-1.222.03-1.666.031-.456.097-.86.255-1.242a3.75 3.75 0 012.03-2.03c.382-.158.786-.224 1.242-.255.444-.03.99-.03 1.666-.03zm8.617 1.527c-.387-.027-.88-.027-1.59-.027H15a.75.75 0 010-1.5h.527c.676 0 1.222 0 1.665.03.457.031.86.097 1.243.255a3.75 3.75 0 012.03 2.03c.158.382.224.786.255 1.242.03.444.03.99.03 1.666V9a.75.75 0 01-1.5 0v-.5c0-.71 0-1.203-.027-1.59-.026-.38-.074-.602-.144-.771a2.25 2.25 0 00-1.218-1.218c-.169-.07-.39-.118-.77-.144zM4 14.25a.75.75 0 01.75.75v.5c0 .71 0 1.203.027 1.59.026.38.074.602.144.771.229.551.667.99 1.218 1.218.169.07.39.118.77.144.388.027.882.027 1.591.027H9a.75.75 0 010 1.5h-.527c-.676 0-1.222 0-1.666-.03-.456-.031-.86-.097-1.242-.255a3.75 3.75 0 01-2.03-2.03c-.158-.382-.224-.786-.255-1.242-.03-.445-.03-.99-.03-1.666V15a.75.75 0 01.75-.75zm16 0a.75.75 0 01.75.75v.527c0 .676 0 1.222-.03 1.665-.031.457-.097.86-.255 1.243a3.75 3.75 0 01-2.03 2.03c-.382.158-.786.224-1.242.255-.445.03-.99.03-1.666.03H15a.75.75 0 010-1.5h.5c.71 0 1.203 0 1.59-.027.38-.026.602-.074.771-.144a2.25 2.25 0 001.218-1.218c.07-.169.118-.39.144-.77.027-.388.027-.882.027-1.591V15a.75.75 0 01.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMaximize3 = React.memo(SvgMaximize3);
export default MemoSvgMaximize3;
