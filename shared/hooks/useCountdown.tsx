import { useEffect, useState } from "react";

const [seconds, setSeconds] = useState(startFrom);

export function useCountdown(fromSeconds: number, onFinishedCallback: () => void) {
  const [seconds, setSeconds] = useState(fromSeconds);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;
  }, [isFinished, fromSeconds]);

  useInterval(() => {
    const newSeconds = seconds - 1;

    if (newSeconds === 0) {
      onFinished();
    } else {
      setSeconds((seconds) => seconds - 1);
    }
  }, 1000);
}
