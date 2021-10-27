import { useEffect, useState } from "react";

export function usePromiseState<T>(promise: Promise<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    setIsLoading(true);
    promise.then((result) => {
      setData(result);
      setIsLoading(false);
    });
  }, [promise]);

  return [data, isLoading] as const;
}
