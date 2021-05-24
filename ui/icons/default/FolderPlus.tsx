import * as React from "react";

function SvgFolderPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2.25h-.116c-.818 0-1.376 0-1.855.128a3.75 3.75 0 00-2.651 2.651c-.128.479-.128 1.037-.128 1.855V14.055c0 1.367 0 2.47.117 3.337.12.9.38 1.658.981 2.26.602.601 1.36.86 2.26.981.867.117 1.97.117 3.337.117h8.11c1.367 0 2.47 0 3.337-.117.9-.12 1.658-.38 2.26-.981.602-.602.86-1.36.982-2.26.116-.867.116-1.97.116-3.337V11.945c0-1.367 0-2.47-.116-3.337-.122-.9-.38-1.658-.982-2.26-.602-.602-1.36-.86-2.26-.982-.867-.116-1.97-.116-3.337-.116h-.934c-.907 0-1.216-.007-1.495-.086a2.249 2.249 0 01-.477-.198c-.254-.14-.477-.355-1.119-.996l-.07-.072c-.544-.543-.92-.92-1.38-1.175a3.752 3.752 0 00-.795-.33C9.28 2.25 8.748 2.25 7.98 2.25H6zM4.418 3.827c.262-.07.604-.077 1.582-.077h1.879c.907 0 1.216.007 1.495.086.166.047.326.114.477.198.254.14.477.354 1.119.996l.07.071c.544.544.92.92 1.38 1.176.251.14.518.25.795.33.505.143 1.037.143 1.806.143H16c1.436 0 2.437.002 3.192.103.734.099 1.122.28 1.399.556.277.277.457.665.556 1.399.102.755.103 1.757.103 3.192v2c0 1.435-.002 2.436-.103 3.192-.099.734-.28 1.122-.556 1.399-.277.277-.665.457-1.4.556-.754.101-1.755.103-3.191.103H8c-1.435 0-2.436-.002-3.192-.103-.734-.099-1.122-.28-1.399-.556-.277-.277-.457-.665-.556-1.4-.101-.755-.103-1.756-.103-3.191V7c0-.978.006-1.32.077-1.582a2.25 2.25 0 011.59-1.591zM12.75 10a.75.75 0 10-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V16a.75.75 0 101.5 0v-2.25H15a.75.75 0 100-1.5h-2.25V10z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFolderPlus = React.memo(SvgFolderPlus);
export default MemoSvgFolderPlus;
