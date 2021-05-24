import * as React from "react";

function SvgSelection(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.462 2.25H6.5v1.5c-.718 0-1.2 0-1.567.038-.355.036-.519.1-.627.173a1.25 1.25 0 00-.345.345c-.073.108-.137.272-.173.627-.037.367-.038.85-.038 1.567h-1.5v-.038c0-.67 0-1.229.046-1.681.048-.473.153-.913.417-1.309.201-.3.459-.558.76-.759.395-.264.835-.369 1.308-.417.452-.046 1.011-.046 1.68-.046zm12.605 1.538c-.367-.037-.85-.038-1.567-.038v-1.5h.038c.67 0 1.229 0 1.681.046.473.048.913.153 1.309.417.3.201.558.459.759.76.264.395.369.835.417 1.308.046.452.046 1.011.046 1.68V6.5h-1.5c0-.718 0-1.2-.038-1.567-.036-.355-.1-.519-.173-.627a1.25 1.25 0 00-.345-.345c-.108-.073-.272-.137-.627-.173zM9.25 3a.75.75 0 01.75-.75h4a.75.75 0 010 1.5h-4A.75.75 0 019.25 3zM3 9.25a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0v-4A.75.75 0 013 9.25zm18 0a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0v-4a.75.75 0 01.75-.75zM2.25 17.538V17.5h1.5c0 .718 0 1.2.038 1.567.036.355.1.519.173.628.09.136.208.253.345.344.108.073.272.137.627.173.367.037.85.038 1.567.038v1.5h-.038c-.67 0-1.229 0-1.681-.046-.473-.048-.913-.153-1.309-.418-.3-.2-.558-.458-.759-.758-.264-.396-.369-.835-.417-1.309-.046-.452-.046-1.011-.046-1.68zm17.962 1.53c.037-.368.038-.85.038-1.568h1.5v.038c0 .67 0 1.229-.046 1.681-.048.473-.153.913-.417 1.309-.201.3-.459.558-.76.759-.395.264-.835.369-1.308.417-.452.046-1.011.046-1.68.046H17.5v-1.5c.718 0 1.2 0 1.567-.038.355-.036.519-.1.628-.173a1.25 1.25 0 00.344-.345c.073-.108.137-.272.173-.627zM9.25 21a.75.75 0 01.75-.75h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgSelection = React.memo(SvgSelection);
export default MemoSvgSelection;
