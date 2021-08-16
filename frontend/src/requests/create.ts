import axios from "axios";
import { useState } from "react";
import { JsonValue } from "~shared/types";
import { readCurrentToken } from "~frontend/authentication/cookie";
import { useEqualEffect } from "~shared/hooks/useEqualEffect";

export function createBackendRequestSender<Input, Output>(route: string) {
  // Response from the server is sent as JSON which mean Dates will be converted to strings. Reflect it in the result type.
  type JSONOutput = JsonValue<Output>;
  const fullRoute = `/api/backend/${route}`.replace(`//`, `/`);

  async function send(input: Input): Promise<JSONOutput> {
    const response = await axios.post<JSONOutput>(fullRoute, input, {
      headers: {
        Authorization: `Bearer ${readCurrentToken()}`,
      },
    });

    return response.data;
  }

  function useBackendRequestSender(input: Input) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<JSONOutput | undefined>();

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
    use: useBackendRequestSender,
  };
}
