import { isAfter, subMinutes } from "date-fns";

expect.extend({
  toBeRecent(received: Date) {
    const now = new Date();
    const aMinuteAgo = subMinutes(now, 1);
    const pass = isAfter(now, aMinuteAgo);
    if (pass) {
      return {
        message: () => `expected ${received} to be within a minute ago`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be witing a minute ago - actual: ${received.toISOString()}`,
        pass: false,
      };
    }
  },
});
