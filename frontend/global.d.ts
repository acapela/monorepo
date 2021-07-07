// Ensure this is treated as a module.
export {};

declare global {
  interface Window {
    Userback: {
      access_token: string;
    };
    analytics: any;
  }
}
