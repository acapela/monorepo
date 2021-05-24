import * as React from "react";

function SvgHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.702 5.359c.682-.682 1.14-1.139 1.528-1.434.37-.283.586-.347.77-.347.184 0 .4.064.77.347.387.295.846.752 1.528 1.434L16.47 7.53l.242.243c.91.91 1.209 1.227 1.367 1.609.158.381.171.816.171 2.103V15c0 1.435-.002 2.436-.103 3.192-.099.734-.28 1.122-.556 1.399-.277.277-.665.457-1.4.556-.754.101-1.756.103-3.191.103h-2c-1.435 0-2.437-.002-3.192-.103-.734-.099-1.122-.28-1.399-.556-.277-.277-.457-.665-.556-1.4-.101-.755-.103-1.756-.103-3.191v-3.515c0-1.287.013-1.722.171-2.103.158-.38.455-.697 1.359-1.601l.008-.008.242-.243 2.172-2.171zM6.47 6.469l2.171-2.171.037-.037c.635-.635 1.165-1.165 1.642-1.529.504-.384 1.036-.654 1.68-.654.644 0 1.176.27 1.68.654.477.364 1.007.894 1.642 1.53l.037.036 2.17 2.17.001.002.243.242.002.002.099.1.19.19 4.466 4.466a.75.75 0 01-1.06 1.06l-1.721-1.72.001.533v3.712c0 1.367 0 2.47-.116 3.337-.122.9-.38 1.658-.982 2.26-.602.601-1.36.86-2.26.981-.867.117-1.97.117-3.337.117H10.945c-1.367 0-2.47 0-3.337-.117-.9-.12-1.658-.38-2.26-.981-.602-.602-.86-1.36-.981-2.26-.117-.867-.117-1.97-.117-3.337v-3.712l.001-.534-1.72 1.721a.75.75 0 11-1.061-1.06l4.466-4.467.19-.19.1-.1h.001l.243-.243z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgHome = React.memo(SvgHome);
export default MemoSvgHome;
