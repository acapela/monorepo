import { wait } from "@aca/shared/time";

export default function ObscureErrorTestPage() {
  const triggerMayhem = async () => {
    // For testing this we want to give playwright some time to listen to network requests
    await wait(100);
    throw new Error(
      "This page errors by design, it is merely here to test Sentry client-side reporting working correctly"
    );
  };
  return <button onClick={triggerMayhem}>Cause Mayhem</button>;
}
