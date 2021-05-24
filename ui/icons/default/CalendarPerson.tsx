import * as React from "react";

function SvgCalendarPerson(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 .25a.75.75 0 01.75.75v1.25h4.306c.803 0 1.532 0 2.194.013V1a.75.75 0 011.5 0v1.327c.26.02.506.045.739.076 1.172.158 2.121.49 2.87 1.238.748.749 1.08 1.698 1.238 2.87.153 1.14.153 2.595.153 4.433v2.112c0 1.838 0 3.294-.153 4.433-.158 1.172-.49 2.121-1.238 2.87-.749.748-1.698 1.08-2.87 1.238-1.14.153-2.595.153-4.433.153h-2.112c-1.838 0-3.294 0-4.433-.153-1.172-.158-2.121-.49-2.87-1.238-.748-.749-1.08-1.698-1.238-2.87-.153-1.14-.153-2.595-.153-4.433V9.301c0-1.061 0-1.902.054-2.581.055-.694.17-1.282.436-1.82A4.75 4.75 0 014.9 2.74c.538-.266 1.126-.38 1.82-.436.166-.013.343-.023.53-.03V1A.75.75 0 018 .25zm7.25 3.513V4a.75.75 0 001.5 0v-.168c.19.016.369.035.54.058 1.005.135 1.585.389 2.008.812.423.423.677 1.003.812 2.009.138 1.028.14 2.382.14 4.289v2c0 1.907-.002 3.262-.14 4.29-.135 1.005-.389 1.585-.812 2.008-.423.423-1.003.677-2.009.812-1.027.138-2.382.14-4.289.14h-2c-1.907 0-3.261-.002-4.29-.14-1.005-.135-1.585-.389-2.008-.812-.423-.423-.677-1.003-.812-2.009-.138-1.027-.14-2.382-.14-4.289V9.333c0-1.1 0-1.882.05-2.494.047-.604.138-.979.285-1.276a3.25 3.25 0 011.478-1.478c.297-.147.672-.238 1.276-.286.129-.01.265-.018.411-.025V4a.75.75 0 001.5 0v-.25H13c.854 0 1.597 0 2.25.013zM12 7.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM9.25 9a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0zm.75 4.25A2.75 2.75 0 007.25 16c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0016.75 16 2.75 2.75 0 0014 13.25h-4zM8.75 16c0-.69.56-1.25 1.25-1.25h4c.69 0 1.25.56 1.25 1.25a.25.25 0 01-.25.25H9a.25.25 0 01-.25-.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCalendarPerson = React.memo(SvgCalendarPerson);
export default MemoSvgCalendarPerson;
