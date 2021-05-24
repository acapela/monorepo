import * as React from "react";

function SvgNote2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.75 1a.75.75 0 00-1.5 0v1.327c-.26.02-.506.045-.739.076-1.172.158-2.121.49-2.87 1.238-.748.749-1.08 1.698-1.238 2.87-.153 1.14-.153 2.595-.153 4.433v2.112c0 1.838 0 3.294.153 4.433.158 1.172.49 2.121 1.238 2.87.749.748 1.698 1.08 2.87 1.238 1.14.153 2.595.153 4.433.153h2.112c1.838 0 3.294 0 4.433-.153 1.172-.158 2.121-.49 2.87-1.238.748-.749 1.08-1.698 1.238-2.87.153-1.14.153-2.595.153-4.433v-2.112c0-1.838 0-3.294-.153-4.433-.158-1.172-.49-2.121-1.238-2.87-.749-.748-1.698-1.08-2.87-1.238-.233-.031-.48-.056-.739-.076V1a.75.75 0 00-1.5 0v1.263c-.662-.013-1.391-.013-2.194-.013h-.306V1a.75.75 0 00-1.5 0v1.25h-.306c-.803 0-1.532 0-2.194.013V1zm6.5 2.763c-.653-.013-1.396-.013-2.25-.013h-.25V5a.75.75 0 01-1.5 0V3.75H11c-.854 0-1.597 0-2.25.013V5a.75.75 0 01-1.5 0V3.832c-.19.016-.369.035-.54.058-1.005.135-1.585.389-2.008.812-.423.423-.677 1.003-.812 2.009-.138 1.028-.14 2.382-.14 4.289v2c0 1.907.002 3.262.14 4.29.135 1.005.389 1.585.812 2.008.423.423 1.003.677 2.009.812 1.028.138 2.382.14 4.289.14h2c1.907 0 3.262-.002 4.29-.14 1.005-.135 1.585-.389 2.008-.812.423-.423.677-1.003.812-2.009.138-1.027.14-2.382.14-4.289v-2c0-1.907-.002-3.261-.14-4.29-.135-1.005-.389-1.585-.812-2.008-.423-.423-1.003-.677-2.009-.812-.17-.023-.35-.042-.539-.058V5a.75.75 0 01-1.5 0V3.763z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgNote2 = React.memo(SvgNote2);
export default MemoSvgNote2;
