import * as React from "react";

function SvgVolumeCross(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.04 6.724c.755-.906 1.27-1.522 1.675-1.893.181-.165.295-.24.359-.272.028.065.067.195.1.439.074.544.076 1.347.076 2.526v8.952c0 1.179-.002 1.982-.076 2.527a1.793 1.793 0 01-.1.438 1.794 1.794 0 01-.359-.272c-.405-.371-.92-.987-1.675-1.893l-.264-.317-.088-.105c-.503-.604-.9-1.083-1.458-1.344-.558-.262-1.18-.26-1.967-.26H6c-.964 0-1.612-.002-2.095-.066-.461-.063-.659-.17-.789-.3-.13-.13-.237-.328-.3-.79-.064-.482-.066-1.13-.066-2.094s.002-1.611.067-2.095c.062-.461.169-.659.3-.789.13-.13.327-.237.788-.3C4.388 8.753 5.036 8.75 6 8.75h.263c.786.001 1.409.002 1.967-.26.557-.26.955-.74 1.458-1.344l.088-.105.264-.317zm2.1-2.19s-.005.002-.011.002l.01-.002zm-.094-.028l-.007-.008s.003.001.007.008zm-.007 14.996l.007-.008c-.004.007-.007.009-.007.008zm.098-.037h-.008.008zm.459-16.348c-.774-.28-1.434.187-1.893.608-.49.448-1.07 1.145-1.776 1.991l-.04.048-.264.317c-.634.761-.813.95-1.03 1.051-.216.101-.475.118-1.466.118h-.179c-.898 0-1.648 0-2.242.08-.628.084-1.195.27-1.65.725-.456.456-.642 1.023-.726 1.65-.08.595-.08 1.345-.08 2.243v.104c0 .899 0 1.648.08 2.242.084.628.27 1.195.725 1.65.456.456 1.023.642 1.65.726.595.08 1.345.08 2.243.08h.179c.99 0 1.25.017 1.466.118.217.102.396.29 1.03 1.051l.264.317.04.048c.705.847 1.286 1.543 1.776 1.991.46.421 1.12.888 1.893.608.773-.28.98-1.061 1.065-1.679.09-.657.089-1.564.089-2.666V7.462c0-1.102 0-2.009-.09-2.666-.083-.618-.291-1.4-1.064-1.68zM17.53 9.47a.75.75 0 10-1.06 1.06l1.97 1.97-1.97 1.97a.75.75 0 001.06 1.06l1.97-1.97 1.97 1.97a.75.75 0 001.06-1.06l-1.97-1.97 1.97-1.97a.75.75 0 00-1.06-1.06l-1.97 1.97-1.97-1.97z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgVolumeCross = React.memo(SvgVolumeCross);
export default MemoSvgVolumeCross;
