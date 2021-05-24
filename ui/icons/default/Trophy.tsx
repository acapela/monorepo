import * as React from "react";

function SvgTrophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.3 2.25H14.7c.594 0 1.09 0 1.493.037.422.038.816.12 1.181.331a2.75 2.75 0 011.007 1.007c.115.2.192.408.244.625H20A2.75 2.75 0 0122.75 7 4.75 4.75 0 0118 11.75h-.127a4.75 4.75 0 01-2.055 1.638c-.474.197-.982.281-1.578.322-.42.029-.91.037-1.49.04v2.5h.583a3.417 3.417 0 013.417 3.417c0 1.15-.933 2.083-2.083 2.083H9.333a2.083 2.083 0 01-2.083-2.083 3.417 3.417 0 013.417-3.417h.583v-2.5c-.58-.003-1.07-.011-1.49-.04-.596-.04-1.104-.125-1.578-.322a4.75 4.75 0 01-2.055-1.638H6A4.75 4.75 0 011.25 7 2.75 2.75 0 014 4.25h1.374c.052-.217.13-.425.244-.625a2.75 2.75 0 011.007-1.007c.365-.21.76-.293 1.18-.331.404-.037.9-.037 1.494-.037zm2.7 15.5h-1.333a1.917 1.917 0 00-1.917 1.917c0 .322.261.583.583.583h5.334a.583.583 0 00.583-.583 1.917 1.917 0 00-1.917-1.917H12zM18.75 6.3l-.001-.55H20c.69 0 1.25.56 1.25 1.25a3.251 3.251 0 01-2.668 3.198c.066-.297.105-.613.128-.958.04-.584.04-1.304.04-2.212V6.298zM5.251 5.75H4c-.69 0-1.25.56-1.25 1.25a3.251 3.251 0 002.668 3.198 6.381 6.381 0 01-.128-.958c-.04-.584-.04-1.304-.04-2.213V6.3l.001-.549zm2.69-1.97c-.317.03-.467.08-.566.137a1.25 1.25 0 00-.458.458c-.057.099-.108.249-.137.566-.03.328-.03.755-.03 1.392V7c0 .942 0 1.611.036 2.138.036.52.103.845.211 1.106a3.25 3.25 0 001.76 1.759c.26.108.586.175 1.105.21.527.037 1.196.037 2.138.037s1.611 0 2.138-.036c.52-.036.845-.103 1.106-.211a3.25 3.25 0 001.759-1.76c.108-.26.175-.586.21-1.105.037-.527.037-1.196.037-2.138v-.667c0-.637 0-1.064-.03-1.392-.03-.317-.08-.467-.137-.566a1.25 1.25 0 00-.458-.458c-.099-.057-.249-.108-.566-.137-.328-.03-.756-.03-1.392-.03H9.333c-.637 0-1.064 0-1.392.03z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgTrophy = React.memo(SvgTrophy);
export default MemoSvgTrophy;
