import * as React from "react";

function SvgComment2Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 12A8.25 8.25 0 1112 20.25H4.387c.055-.09.107-.174.155-.256.225-.384.397-.74.484-1.115.063-.27.078-.38.092-.657.02-.405-.082-.886-.233-1.437a62.542 62.542 0 00-.693-2.25l-.006-.018c-.257-.805-.436-1.671-.436-2.517zm-1.5 9c0-.158.049-.304.132-.424.392-.59.67-1.006.866-1.34.196-.336.28-.539.317-.696.025-.11.034-.156.04-.195.005-.04.01-.086.015-.199.007-.14-.03-.413-.181-.964a62.045 62.045 0 00-.682-2.208c-.288-.9-.507-1.927-.507-2.974 0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75H3a.75.75 0 01-.75-.75zm10.5-12a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgComment2Plus = React.memo(SvgComment2Plus);
export default MemoSvgComment2Plus;
