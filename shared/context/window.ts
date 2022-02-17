import { createContext, useContext } from "react";

export function getWindow() {
  return typeof window !== "undefined" ? window : null;
}

export function getDocument() {
  return typeof document !== "undefined" ? document : null;
}

const contextWindow = createContext<Window | null>(getWindow());

export function useWindow() {
  return useContext(contextWindow) ?? getWindow();
}

export function useDocument() {
  return useWindow()?.document ?? null;
}

export const WindowContext = contextWindow.Provider;
