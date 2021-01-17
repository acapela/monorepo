export interface Notification {
  getContent(): string;
  getRecipientEmail(): string;
  getSubject(): string;
}
