import axios from "axios";
import { useState } from "react";
import { parseDatesInObject } from "~frontend/../../shared/dates/parseJSONWithDates";
import { readCurrentToken } from "~frontend/authentication/cookie";
import { useEqualEffect } from "~shared/hooks/useEqualEffect";

export function createBackendRequestSender<Input, Output>(route: string) {
  const fullRoute = `/api/backend/${route}`.replace(`//`, `/`);

  async function send(input: Input): Promise<Output> {
    const response = await axios.post<Output>(fullRoute, input, {
      headers: {
        Authorization: `Bearer ${readCurrentToken()}`,
      },
    });

    const dataWithDatesParsed = parseDatesInObject(response.data);

    return dataWithDatesParsed;
  }

  function use(input: Input) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Output | undefined>();

    useEqualEffect(() => {
      setIsLoading(true);

      send(input).then((data) => {
        setIsLoading(false);
        setData(data);
      });
    }, [input]);

    return [data, { isLoading }] as const;
  }

  return {
    send,
    use,
  };
}
