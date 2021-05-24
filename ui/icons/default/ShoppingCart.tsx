import * as React from "react";

function SvgShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 2.75c.285 0 .384 0 .468.008.85.07 1.589.614 1.906 1.407.031.079.06.173.144.445l1.962 6.375.013.043c.303.984.55 1.784.823 2.408.286.65.63 1.18 1.172 1.58.54.4 1.15.574 1.855.656.677.078 1.514.078 2.543.078h2.195c1.037 0 1.88 0 2.56-.08.71-.082 1.323-.257 1.865-.661.543-.404.887-.94 1.17-1.596.272-.63.514-1.437.812-2.43l.013-.043.173-.575.017-.058c.339-1.13.617-2.057.727-2.802.114-.775.073-1.511-.4-2.146-.472-.636-1.166-.887-1.941-1-.745-.109-1.713-.109-2.893-.109H5.477l-.025-.081-.01-.031c-.07-.23-.118-.387-.175-.53A3.75 3.75 0 002.09 1.264a7.052 7.052 0 00-.557-.013H1.5V2v-.75H1a.75.75 0 000 1.5h.5zm5.914 7.794L5.939 5.75h10.685c1.255 0 2.113.002 2.736.093.605.088.828.24.955.41.127.172.208.428.12 1.033-.093.624-.338 1.446-.698 2.648l-.173.575c-.314 1.046-.532 1.77-.765 2.31-.225.521-.434.797-.688.986-.254.19-.579.31-1.143.376-.584.068-1.34.07-2.432.07H12.43c-1.085 0-1.835-.002-2.415-.07-.56-.064-.884-.184-1.137-.371s-.463-.46-.69-.977c-.234-.535-.456-1.252-.775-2.289zM10 18.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM7.25 20a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0zM18 18.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM15.25 20a2.75 2.75 0 115.5 0 2.75 2.75 0 01-5.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoSvgShoppingCart = React.memo(SvgShoppingCart);
export default MemoSvgShoppingCart;
