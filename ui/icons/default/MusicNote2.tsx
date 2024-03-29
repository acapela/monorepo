import * as React from "react";

function SvgMusicNote2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.75 3.332c-.352.051-.806.157-1.472.314l-5.022 1.182c-.758.178-1.261.298-1.633.434-.352.13-.505.245-.603.37-.098.124-.176.298-.221.671-.048.393-.049.91-.049 1.689v.047l10.499-2.624c-.002-.382-.01-.677-.03-.92-.03-.348-.084-.504-.138-.598a1.25 1.25 0 00-.718-.568c-.103-.031-.267-.048-.614.003zM20.25 16a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0zm0-9.04V13a3.75 3.75 0 101.5 3V5.967c0-.643 0-1.173-.037-1.6-.037-.438-.119-.85-.335-1.223a2.75 2.75 0 00-1.578-1.25c-.412-.125-.832-.11-1.268-.046-.423.062-.94.183-1.565.33l-.032.008-5.023 1.182-.043.01c-.703.165-1.295.305-1.762.476-.495.18-.929.425-1.263.846-.334.422-.471.9-.535 1.424-.059.493-.059 1.101-.059 1.823V16a3.75 3.75 0 101.5 3V9.586l10.5-2.625zM6 16.75a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMusicNote2 = React.memo(SvgMusicNote2);
export default MemoSvgMusicNote2;
