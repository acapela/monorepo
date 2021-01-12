jest.mock("@sendgrid/mail", () => {
  return {
    setApiKey(): void {
      return;
    },
    send(): void {
      return;
    },
  };
});
