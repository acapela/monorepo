import * as React from "react";

function SvgFilter2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.392 2.25h11.216c.905 0 1.668 0 2.234.081.56.081 1.226.281 1.528.952.3.671.008 1.301-.304 1.774-.315.477-.822 1.047-1.424 1.724l-.04.046-3.394 3.818c-.651.733-.895 1.014-1.064 1.324a3.25 3.25 0 00-.31.814c-.08.345-.084.716-.084 1.696V19a2.75 2.75 0 11-5.5 0v-4.52c0-.98-.005-1.352-.085-1.697a3.25 3.25 0 00-.31-.814c-.168-.31-.412-.591-1.063-1.324L4.398 6.827l-.04-.046c-.602-.677-1.109-1.247-1.424-1.724-.312-.473-.605-1.103-.304-1.774.302-.67.967-.87 1.528-.952.566-.081 1.329-.081 2.234-.081zM3.976 3.928s.002-.003.01-.008c-.005.006-.01.009-.01.008zm.038-.024c.048-.023.152-.058.358-.088.446-.064 1.098-.066 2.082-.066h11.092c.984 0 1.636.002 2.082.066.206.03.31.065.358.088a1.322 1.322 0 01-.172.327c-.248.375-.68.864-1.333 1.6l-3.395 3.818-.06.067c-.57.642-.938 1.056-1.2 1.537a4.75 4.75 0 00-.452 1.19c-.124.533-.124 1.087-.124 1.946V19a1.25 1.25 0 11-2.5 0v-4.52-.09c0-.86 0-1.414-.124-1.947a4.75 4.75 0 00-.452-1.19c-.261-.48-.63-.895-1.2-1.537l-.06-.067L5.518 5.83c-.653-.735-1.085-1.224-1.333-1.6a1.322 1.322 0 01-.172-.326zm16.01.024s-.005-.002-.01-.008c.008.005.01.008.01.008zm-.03-.055c-.002-.008-.001-.013 0-.013v.013zm-15.987 0c-.002-.01-.001-.013 0-.013v.013z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgFilter2 = React.memo(SvgFilter2);
export default MemoSvgFilter2;
