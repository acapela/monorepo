import * as React from "react";

function SvgMusicNote3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.714 3.308c.59-.138.952-.222 1.216-.245a.789.789 0 01.225.004.787.787 0 01.056.218c.037.263.039.635.039 1.24v.913c0 .394-.001.622-.021.789a.65.65 0 01-.031.145v.001h-.002l-.01.009a.652.652 0 01-.123.057c-.157.06-.378.117-.76.212L9.75 9.04V7.992c0-.779.001-1.296.049-1.689.045-.373.123-.547.221-.671.098-.125.25-.24.603-.37.372-.136.875-.256 1.633-.434l6.458-1.52zm.953 4.798l-9.917 2.48V19a3.75 3.75 0 11-1.5-3V7.947c0-.722 0-1.33.06-1.823.063-.524.2-1.002.534-1.424.334-.421.768-.665 1.263-.846.467-.171 1.059-.31 1.762-.476l.043-.01 6.458-1.52.05-.011c.524-.124.993-.234 1.378-.268.418-.037.883 0 1.289.322.405.321.548.766.608 1.18.055.383.055.865.055 1.403v1.002c0 .343 0 .663-.032.93-.035.295-.117.607-.339.89-.22.284-.503.439-.782.545-.25.096-.561.173-.894.256l-.036.01zM8.25 19a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgMusicNote3 = React.memo(SvgMusicNote3);
export default MemoSvgMusicNote3;
