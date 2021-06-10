import Axios, { AxiosResponse } from "axios";
import { assertGet } from "~shared/assert";

type HasuraRequestPayload = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
};

export type DeleteJobResponse = {
  message: string;
};

export type ScheduleRequestResponse = {
  message: string;
};

export type HasuraHeader = {
  name: string;
  value: string;
};

const apiUrl = assertGet(process.env.HASURA_API_URL, "HASURA_API_URL env variable is required");
const apiSecret = assertGet(process.env.HASURA_API_SECRET, "HASURA_API_SECRET env variable is required");
const apiRole = assertGet(process.env.HASURA_API_ADMIN_ROLE, "HASURA_API_ADMIN_ROLE env variable is required");

export default abstract class Hasura {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

  static async authenticatedRequest(
    requestPayload: HasuraRequestPayload,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<ScheduleRequestResponse>> {
    return await Axios.post(apiUrl, requestPayload, {
      headers: {
        "X-Hasura-Role": apiRole,
        "x-hasura-admin-secret": apiSecret,
        ...headers,
      },
    });
  }
  /**
   *
   * @param name
   * @param schedule - cron formatted interval
   * @param webhook - url of the webhook that cron job will hit
   * @param payload - JSON parsable object that will be sent to the webhook
   * @param include_in_metadata
   * @param comment
   */

  static scheduleJob(job: {
    name: string;
    schedule: string;
    webhook: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    comment: string;
    include_in_metadata: boolean;
    headers?: Array<HasuraHeader>;
  }): Promise<AxiosResponse<ScheduleRequestResponse>> {
    return Hasura.authenticatedRequest({
      type: "create_cron_trigger",
      args: job,
    });
  }

  /**
   *
   * @param name - name of the job to be deleted
   */
  static deleteJob(name: string): Promise<AxiosResponse<DeleteJobResponse>> {
    return Hasura.authenticatedRequest({
      type: "delete_cron_trigger",
      args: { name },
    });
  }
}
