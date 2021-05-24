import * as React from "react";

function SvgPresentationChart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.25 3A.75.75 0 012 2.25h20a.75.75 0 010 1.5h-1.25v5.305c0 1.367 0 2.47-.116 3.337-.122.9-.38 1.658-.982 2.26-.602.602-1.36.86-2.26.982-.867.116-1.97.116-3.337.116H12.75v1.825l4.636 2.782a.75.75 0 11-.772 1.286l-3.864-2.318V21a.75.75 0 01-1.5 0v-1.675l-3.864 2.318a.75.75 0 11-.772-1.286l4.636-2.782V15.75H9.945c-1.367 0-2.47 0-3.337-.117-.9-.12-1.658-.38-2.26-.981-.602-.602-.86-1.36-.981-2.26-.117-.867-.117-1.97-.117-3.337V3.75H2A.75.75 0 011.25 3zM12 14.25h2c1.435 0 2.436-.002 3.192-.103.734-.099 1.122-.28 1.399-.556.277-.277.457-.665.556-1.4.101-.755.103-1.756.103-3.191V3.75H4.75V9c0 1.435.002 2.437.103 3.192.099.734.28 1.122.556 1.399.277.277.665.457 1.4.556.754.101 1.756.103 3.191.103h2zM8.75 9a.75.75 0 00-1.5 0v2a.75.75 0 001.5 0V9zM12 6.25a.75.75 0 01.75.75v4a.75.75 0 01-1.5 0V7a.75.75 0 01.75-.75zM16.75 8a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0V8z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgPresentationChart = React.memo(SvgPresentationChart);
export default MemoSvgPresentationChart;
