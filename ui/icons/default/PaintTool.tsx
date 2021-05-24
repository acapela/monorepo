import * as React from "react";

function SvgPaintTool(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.975 1.25H14.025c.445 0 .816 0 1.12.02.318.022.617.07.907.19a2.75 2.75 0 011.489 1.488c.12.29.167.59.188.907.009.12.014.252.017.395.578 0 1.068.005 1.473.046.473.048.913.153 1.309.417.3.201.558.459.759.76.264.395.369.835.417 1.308.046.452.046 1.011.046 1.68v.077c0 .67 0 1.229-.046 1.681-.048.474-.153.913-.418 1.309-.2.3-.458.558-.758.758-.396.265-.835.37-1.309.418-.452.046-1.011.046-1.68.046H15c-.964 0-1.612.002-2.095.066-.461.063-.659.17-.789.3-.13.13-.237.328-.3.79-.049.366-.062.826-.065 1.448A2.751 2.751 0 0113.75 18v2a2.75 2.75 0 11-5.5 0v-2c0-1.26.846-2.32 2-2.647.004-.64.018-1.19.08-1.647.084-.628.27-1.195.726-1.65.455-.456 1.022-.642 1.65-.726.594-.08 1.344-.08 2.242-.08H17.5c.718 0 1.2 0 1.567-.038.355-.036.519-.1.628-.173a1.25 1.25 0 00.344-.345c.073-.108.137-.272.173-.627.037-.367.038-.85.038-1.567 0-.718 0-1.2-.038-1.567-.036-.355-.1-.519-.173-.627a1.25 1.25 0 00-.345-.345c-.108-.073-.272-.137-.627-.173-.324-.033-.736-.037-1.322-.038a8.43 8.43 0 01-.016.395 2.822 2.822 0 01-.188.907 2.75 2.75 0 01-1.489 1.489c-.29.12-.59.167-.907.188-.304.021-.675.021-1.12.021H7.975c-.445 0-.816 0-1.12-.02a2.823 2.823 0 01-.907-.19 2.75 2.75 0 01-1.489-1.488c-.12-.29-.167-.59-.188-.907-.021-.304-.021-.675-.021-1.12v-.05c0-.445 0-.816.02-1.12.022-.317.07-.617.19-.907a2.75 2.75 0 011.488-1.489c.29-.12.59-.167.907-.188.304-.021.675-.021 1.12-.021zM16.25 5c0-.476 0-.796-.017-1.043-.017-.241-.046-.358-.078-.435a1.25 1.25 0 00-.677-.677c-.077-.032-.194-.061-.435-.078A17.091 17.091 0 0014 2.75H8c-.476 0-.796 0-1.043.017-.241.017-.358.046-.435.078a1.25 1.25 0 00-.677.677c-.032.077-.061.194-.078.435A17.09 17.09 0 005.75 5c0 .476 0 .796.017 1.043.017.241.046.358.078.435.127.307.37.55.677.677.077.032.194.061.435.078.247.017.567.017 1.043.017h6c.476 0 .796 0 1.043-.017.241-.017.358-.046.435-.078.307-.127.55-.37.677-.677.032-.077.061-.194.078-.435.017-.247.017-.567.017-1.043zM11 16.75c-.69 0-1.25.56-1.25 1.25v2a1.25 1.25 0 102.5 0v-2c0-.69-.56-1.25-1.25-1.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPaintTool = React.memo(SvgPaintTool);
export default MemoSvgPaintTool;
