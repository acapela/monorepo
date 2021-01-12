import config from "./config";
import Axios, { AxiosResponse } from "axios";

type HasuraRequestPayload = {
  type: string;
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

export default abstract class Hasura {
  static apiUrl: string = config.get("hasura.queryApi.url");
  static apiSecret: string = config.get("hasura.queryApi.secret");
  static apiRole: string = config.get("hasura.queryApi.role");

  static async authenticatedRequest(
    requestPayload: HasuraRequestPayload,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<ScheduleRequestResponse>> {
    return await Axios.post(Hasura.apiUrl, requestPayload, {
      headers: {
        "X-Hasura-Role": Hasura.apiRole,
        "x-hasura-admin-secret": Hasura.apiSecret,
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
