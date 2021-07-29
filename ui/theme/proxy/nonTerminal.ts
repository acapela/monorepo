/* eslint-disable @typescript-eslint/ban-types */

const nonTerminalSymbol = Symbol();

export function markAsNotTerminal(input: object) {
  Reflect.set(input, nonTerminalSymbol, true);
}
export function getIsTerminal(input: object) {
  return Reflect.get(input, nonTerminalSymbol) !== true;
}
