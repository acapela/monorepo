/**
 * Why empty?
 *
 * For some reason our VS IDE is not type-checking d.ts files here. I tried 'includes' and 'excludes' tsconfig part, but
 * without success.
 *
 * To avoid digging too deep, Actual module typings are in normal `styled-components.ts` file next to this file.
 *
 * This file is still needed as only `d.ts` files can define 'new typings' (.ts files can only extend existing and typed modules)
 *
 * @see ./styled-components.ts
 */
declare module "styled-components" {}
