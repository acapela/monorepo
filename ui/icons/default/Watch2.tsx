import * as React from "react";

function SvgWatch2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.83 1.25H12.17c.702 0 1.293 0 1.775.057.51.06.978.193 1.394.512.416.32.664.737.854 1.215.166.418.31.94.474 1.555.348.11.67.26.972.462.519.346.964.791 1.31 1.31.434.648.623 1.39.713 2.277.088.866.088 1.951.088 3.32v.084c0 1.369 0 2.454-.088 3.32-.09.888-.28 1.629-.712 2.277a4.753 4.753 0 01-1.311 1.31c-.302.202-.624.351-.972.462-.165.614-.308 1.137-.474 1.555-.19.478-.438.895-.854 1.215-.416.32-.883.451-1.394.512-.482.057-1.073.057-1.774.057H11.83c-.702 0-1.293 0-1.775-.057-.51-.06-.978-.193-1.394-.512-.416-.32-.664-.737-.854-1.215-.166-.418-.31-.94-.474-1.555-.348-.11-.67-.26-.972-.462a4.751 4.751 0 01-1.31-1.31c-.434-.648-.623-1.39-.713-2.277-.088-.866-.088-1.951-.088-3.32v-.084c0-1.369 0-2.454.088-3.32.09-.888.28-1.629.713-2.277a4.75 4.75 0 011.31-1.31c.302-.202.624-.351.972-.462.165-.615.308-1.137.474-1.555.19-.478.438-.895.854-1.215.416-.32.884-.451 1.394-.512.482-.057 1.073-.057 1.774-.057zM8.964 19.69c.084.292.158.525.236.721.135.34.251.486.374.58.123.095.294.17.657.212.382.046.884.047 1.641.047h.254c.757 0 1.259-.001 1.641-.047.363-.043.534-.117.657-.212.123-.094.24-.24.374-.58.078-.196.152-.43.236-.72-.809.059-1.791.059-2.993.059h-.084c-1.202 0-2.185 0-2.993-.06zM14.8 3.59c.078.196.152.43.236.72-.809-.059-1.791-.059-2.993-.059h-.084c-1.202 0-2.185 0-2.993.06a7.76 7.76 0 01.236-.721c.135-.34.251-.486.374-.58.123-.095.294-.17.657-.212.382-.046.884-.047 1.641-.047h.254c.757 0 1.259.001 1.641.047.363.043.534.117.657.212.123.094.24.24.374.58zM7.194 6.298c.361-.241.827-.39 1.596-.468.781-.08 1.79-.08 3.21-.08s2.429 0 3.21.08c.77.079 1.235.227 1.596.468.354.237.66.542.896.896.241.361.39.827.468 1.596.08.781.08 1.79.08 3.21s0 2.429-.08 3.21c-.079.77-.227 1.235-.468 1.596-.237.354-.542.66-.896.896-.361.241-.827.39-1.596.468-.781.08-1.79.08-3.21.08s-2.429 0-3.21-.08c-.77-.079-1.235-.227-1.596-.468a3.25 3.25 0 01-.896-.896c-.241-.361-.39-.827-.468-1.596-.08-.781-.08-1.79-.08-3.21s0-2.429.08-3.21c.079-.77.227-1.235.468-1.596a3.25 3.25 0 01.896-.896zM12.75 10a.75.75 0 00-1.5 0v2c0 .25.125.485.334.624l1.5 1a.75.75 0 10.832-1.248l-1.166-.777V10z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgWatch2 = React.memo(SvgWatch2);
export default MemoSvgWatch2;
