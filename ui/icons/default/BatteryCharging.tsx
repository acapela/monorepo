import * as React from "react";

function SvgBatteryCharging(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.711 6.237a.75.75 0 10-1.422-.474l-2 6A.75.75 0 009 12.75h2.96l-1.671 5.013a.75.75 0 001.422.474l2-6A.75.75 0 0013 11.25h-2.96l1.671-5.013zM6.473 5.25H7a.75.75 0 010 1.5h-.5c-.71 0-1.203 0-1.59.027-.38.026-.602.074-.771.144A2.25 2.25 0 002.921 8.14c-.07.169-.118.39-.144.77-.027.387-.027.882-.027 1.591v3c0 .71 0 1.204.027 1.59.026.38.074.602.144.771.229.551.667.99 1.218 1.218.169.07.39.118.77.144.388.027.882.027 1.591.027H7a.75.75 0 010 1.5h-.527c-.676 0-1.222 0-1.666-.03-.456-.031-.86-.097-1.242-.255a3.75 3.75 0 01-2.03-2.03c-.158-.382-.224-.786-.255-1.242-.03-.444-.03-.99-.03-1.666V10.473c0-.676 0-1.222.03-1.666.031-.456.097-.86.255-1.242a3.75 3.75 0 012.03-2.03c.382-.158.786-.224 1.242-.255.444-.03.99-.03 1.666-.03zM17.09 6.777c-.387-.027-.88-.027-1.59-.027H15a.75.75 0 010-1.5h.527c.676 0 1.222 0 1.665.03.457.031.86.097 1.243.255a3.75 3.75 0 012.03 2.03c.091.222.152.451.193.694.136.007.26.02.378.044a2.75 2.75 0 012.161 2.16c.053.268.053.571.053.964v1.146c0 .393 0 .696-.053.963a2.75 2.75 0 01-2.16 2.161c-.113.022-.231.035-.36.043A3.751 3.751 0 0117 18.75h-2a.75.75 0 010-1.5h2A2.25 2.25 0 0019.25 15v-4.5c0-.71 0-1.204-.027-1.59-.026-.38-.074-.602-.144-.771A2.25 2.25 0 0017.86 6.92c-.169-.07-.39-.118-.77-.144zm3.66 3.695c0-.25 0-.482-.002-.697.494.1.88.487.978.981.02.103.024.243.024.744v1c0 .5-.004.641-.024.744a1.25 1.25 0 01-.976.98v-3.753z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgBatteryCharging = React.memo(SvgBatteryCharging);
export default MemoSvgBatteryCharging;
