import * as React from "react";

function SvgCommentSlash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.47 1.47a.75.75 0 111.06 1.06l-19 19a.75.75 0 01-1.06-1.06L4.5 18.438A3.751 3.751 0 012.25 15V9.945c0-1.367 0-2.47.117-3.337.12-.9.38-1.658.981-2.26.602-.602 1.36-.86 2.26-.981.867-.117 1.97-.117 3.337-.117H19.69l1.78-1.78zm-3.28 3.28H9c-1.435 0-2.437.002-3.192.103-.734.099-1.122.28-1.399.556-.277.277-.457.665-.556 1.4-.101.754-.103 1.756-.103 3.191v5a2.25 2.25 0 001.958 2.231L18.19 4.75zM21.75 7a.75.75 0 00-1.5 0v11.787l-1.225-.613-.08-.04c-.765-.383-1.259-.63-1.798-.757-.54-.127-1.092-.127-1.947-.127H10a.75.75 0 000 1.5h5.111c.974 0 1.343.005 1.691.087.35.082.68.243 1.552.678l2.31 1.156A.75.75 0 0021.75 20V7z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgCommentSlash = React.memo(SvgCommentSlash);
export default MemoSvgCommentSlash;
