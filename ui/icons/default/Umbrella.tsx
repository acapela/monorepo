import * as React from "react";

function SvgUmbrella(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.078 3.189c-2.699.88-4.255 2.946-5.165 4.902-.383.823-.614 1.33-.703 1.74-.073.337-.04.561.139.841.157.247.36.39.805.476.505.099 1.197.102 2.266.102h.84c.061-2.516.436-4.826 1.101-6.578.2-.527.438-1.031.717-1.483zM12 1.25c-5.362 0-8.105 3.324-9.447 6.208l-.032.067c-.341.734-.648 1.394-.777 1.989-.148.685-.071 1.32.34 1.964.432.678 1.044.998 1.783 1.143.665.13 1.505.13 2.481.129h4.902V20a1.25 1.25 0 01-2.5 0v-1a.75.75 0 00-1.5 0v1a2.75 2.75 0 105.5 0v-7.25h4.902c.976 0 1.816 0 2.48-.13.74-.144 1.352-.464 1.784-1.142.411-.645.488-1.279.34-1.964-.129-.595-.436-1.255-.777-1.989l-.032-.067C20.105 4.574 17.362 1.25 12 1.25zm0 1.5c-.735 0-1.563.678-2.236 2.453-.585 1.54-.942 3.658-1.004 6.047h6.482c-.058-2.609-.418-4.738-1.003-6.226C13.584 3.357 12.77 2.75 12 2.75zm4.742 8.5c-.057-2.725-.432-5.058-1.106-6.774a8.087 8.087 0 00-.615-1.254c2.638.898 4.167 2.937 5.066 4.87.383.822.614 1.328.703 1.739.073.337.04.561-.139.841-.157.247-.36.39-.805.476-.505.099-1.197.102-2.266.102h-.838z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgUmbrella = React.memo(SvgUmbrella);
export default MemoSvgUmbrella;
